// src/seo/siteConfig.js
// Central place to manage site-wide SEO defaults.

export const SITE = {
  name: "Bipana's Brushwork",
  // Keep this in sync with your primary domain.
  url: 'https://bipanaart.com',
  // A short, human description. Keep it under ~160 chars for best snippet display.
  description:
    'Explore original artworks shaped by the spirit of Nepal and the Himalayas, telling stories through rich color, texture, and emotion.',
  // Optional social profiles used in structured data.
  social: {
    instagram: 'https://www.instagram.com/brushworkbybipana',
    etsy: 'https://bipanasbrushwork.etsy.com',
    pinterest: 'https://de.pinterest.com/bipanadahal8844/'
  },
  // Default Open Graph image (add this file to /public if you have one).
  // If you don't have one yet, you can leave it null.
  ogImage: null
};
