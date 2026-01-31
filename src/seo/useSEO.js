// src/seo/useSEO.js
import { useEffect } from 'react';
import { SITE } from './siteConfig';

// Small helper to upsert a <meta> tag by name or property.
function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    el.setAttribute(k, v);
  });
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  if (href) el.setAttribute('href', href);
}

function upsertJsonLd(id, json) {
  const scriptId = `ld-${id}`;
  let el = document.getElementById(scriptId);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = scriptId;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

/**
 * SEO hook for a SPA (React Router).
 * This won't give you SSR-level SEO, but it improves:
 * - titles/snippets
 * - sharing (Open Graph/Twitter)
 * - canonical URLs
 * - structured data
 */
export function useSEO({
  title,
  description,
  path = '/',
  image,
  noindex = false,
  type = 'website',
  jsonLd
} = {}) {
  useEffect(() => {
    const url = new URL(path, SITE.url).toString();
    const fullTitle = title ? `${title} | ${SITE.name}` : SITE.name;
    const desc = description || SITE.description;
    const ogImage = image || SITE.ogImage || undefined;

    document.title = fullTitle;

    // Basics
    upsertMeta('meta[name="description"]', { name: 'description', content: desc });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex,nofollow' : 'index,follow'
    });
    upsertLink('canonical', url);

    // Open Graph
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: desc
    });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    if (ogImage) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    }

    // Twitter
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: ogImage ? 'summary_large_image' : 'summary'
    });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: desc });
    if (ogImage) {
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });
    }

    // Default structured data (Organization + WebSite)
    upsertJsonLd('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.url,
      description: SITE.description
    });
    upsertJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
      sameAs: Object.values(SITE.social).filter(Boolean)
    });

    // Page-specific JSON-LD
    if (jsonLd) {
      upsertJsonLd('page', jsonLd);
    }
  }, [title, description, path, image, noindex, type, jsonLd]);
}
