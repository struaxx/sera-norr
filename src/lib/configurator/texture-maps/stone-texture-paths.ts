// ============================================
// Stone Texture Paths - Seamless sample sources
// ============================================
// IMPORTANT: These paths point to /public/textures/stones/* which must be
// seamless/tileable stone samples (no lifestyle, no catalog grids).

export const DEFAULT_TEXTURE_PATH = '/textures/stones/cream-seamless.jpg';

/**
 * Single source of truth for texture files.
 * If a stone is not in this map, we intentionally DO NOT fall back to
 * stone-library.swatchImage (those may be lifestyle images).
 */
export const STONE_TEXTURE_PATHS: Record<string, string> = {
  // =====================
  // TRAVERTINE (seamless)
  // =====================
  'gore-gray': '/textures/stones/gore-gray-seamless.jpg',
  'ivory': '/textures/stones/ivory-seamless.jpg',
  'super-white-travertine': '/textures/stones/super-white-seamless.jpg',

  'cream-travertine': '/textures/stones/cream-seamless.jpg',
  'light-cream-travertine': '/textures/stones/cream-seamless.jpg',

  'river-silver': '/textures/stones/river-silver-seamless.jpg',
  'silver-grey-travertine': '/textures/stones/river-silver-seamless.jpg',

  'brown-silver': '/textures/stones/brown-silver-seamless.jpg',
  'titanium-silver': '/textures/stones/titanium-silver-seamless.jpg',
  'sbyss-black': '/textures/stones/sbyss-black-seamless.jpg',

  'golden-coast': '/textures/stones/golden-coast-seamless.jpg',
  'classic-cloudy': '/textures/stones/classic-cloudy-seamless.jpg?v=2',
  'classic-light': '/textures/stones/classic-light-seamless.jpg',
  'cream-beige-travertine': '/textures/stones/classic-light-seamless.jpg',

  'soft-rome': '/textures/stones/soft-rome-seamless.jpg',
  'novona-travertine': '/textures/stones/soft-rome-seamless.jpg',

  'sivas-yellow': '/textures/stones/sivas-yellow-seamless.jpg',
  'tiramisu': '/textures/stones/tiramisu-seamless.jpg',
  'swamp-brown': '/textures/stones/swamp-brown-seamless.jpg',
  'jurassico-scurro-travertine': '/textures/stones/swamp-brown-seamless.jpg',
  'antique-red': '/textures/stones/antique-red-seamless.jpg',
  'leonardo-travertine': '/textures/stones/leonardo-seamless.jpg',

  // =================
  // MARBLE (seamless)
  // =================
  'calacatta-viola': '/textures/stones/calacatta-viola-seamless.jpg?v=2',
  'calacatta-vagli': '/textures/stones/calacatta-vagli-seamless.jpg',
  'calacatta-rosa': '/textures/stones/calacatta-rosa-seamless.jpg',

  'arabescato-corchia': '/textures/stones/arabescato-corchia-seamless.jpg',

  'bianco-carrara': '/textures/stones/bianco-carrara-seamless.jpg',
  'volakas-white': '/textures/stones/volakas-white-seamless.jpg',
  'panda-white': '/textures/stones/panda-white-seamless.jpg',
  'grand-antique': '/textures/stones/grand-antique-seamless.jpg',

  'light-emprador': '/textures/stones/light-emperador-seamless.jpg?v=2',
  'light-emperador': '/textures/stones/light-emperador-seamless.jpg?v=2',
  'dark-emperador': '/textures/stones/dark-emperador-seamless.jpg',
  'daino-reale': '/textures/stones/daino-reale-seamless.jpg',
  'elegant-grey': '/textures/stones/elegant-grey-seamless.jpg',
  'london-smoke': '/textures/stones/london-smoke-seamless.jpg',
  'moca-cream-limestone': '/textures/stones/moca-cream-seamless.jpg',
  'nero-marquina': '/textures/stones/nero-marquina-seamless.jpg',
  'taj-mahal': '/textures/stones/taj-mahal-seamless.jpg',
  'taj-mahal-quartzite': '/textures/stones/taj-mahal-seamless.jpg',
  'titanium-silver-travertine': '/textures/stones/titanium-silver-seamless.jpg',
  'verde-alpi': '/textures/stones/verde-alpi-seamless.jpg',

  // Prefer a seamless sample over a possibly-random swatchImage
  'super-white-marble': '/textures/stones/super-white-seamless.jpg',
};
