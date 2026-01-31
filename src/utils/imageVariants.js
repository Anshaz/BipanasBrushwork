import imageVariants from '../data/imageVariants';

// Normalize a public image path like "/Jam on Toast.jpg" -> "jam-on-toast"
const toKey = (publicPath) => {
  const raw = (publicPath || '').toString().trim();
  const noQuery = raw.split('?')[0];
  const file = noQuery.split('/').pop() || '';
  const withoutExt = file.replace(/\.[a-z0-9]+$/i, '');

  return withoutExt
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

/**
 * Returns optimized variants for a given public image path.
 *
 * @param {string} publicPath e.g. "/Everest.jpg"
 */
export const getImageVariants = (publicPath) => {
  const key = toKey(publicPath);
  const v = imageVariants[key];

  if (!v) {
    // Fallback to the original path if an optimized variant doesn't exist.
    return {
      key,
      thumb: publicPath,
      src: publicPath,
      srcSet: undefined,
      sources: []
    };
  }

  const sources = Array.isArray(v.sources) ? [...v.sources].sort((a, b) => a.w - b.w) : [];
  const src = sources.length ? sources[sources.length - 1].src : (v.thumb || publicPath);
  const srcSet = sources.length ? sources.map((s) => `${s.src} ${s.w}w`).join(', ') : undefined;

  return {
    key,
    thumb: v.thumb || src,
    src,
    srcSet,
    sources
  };
};

/**
 * Pick the best source near a target width.
 */
export const pickSource = (publicPath, targetW) => {
  const v = getImageVariants(publicPath);
  if (!v.sources.length) return v.src;
  const t = Number(targetW) || 0;
  return (
    v.sources.find((s) => s.w >= t)?.src ||
    v.sources[v.sources.length - 1].src
  );
};
