// ============================================
// Stone Texture Scales
// ============================================
// Per-stone UV scale tuning (repeat is calculated in TableMesh)
// Higher value = texture covers MORE area = fewer repeats = fewer seams

export const DEFAULT_TEXTURE_SCALE = 2.0;

export const STONE_TEXTURE_SCALES: Record<string, number> = {
  // Bold veining - larger scale to show full vein pattern
  'calacatta-viola': 2.5,
  'calacatta-vagli': 2.5,
  'arabescato-corchia': 2.5,
  'panda-white': 2.5,
  'grand-antique': 2.5,
  'calacatta-rosa': 2.5,
  'london-smoke': 2.2,
  'nero-marquina': 2.2,
  'verde-alpi': 2.2,

  // Travertines - large scale to minimize visible seams
  'ivory': 2.0,
  'cream-travertine': 2.0,
  'light-cream-travertine': 2.0,
  'tiramisu': 2.0,
  'gore-gray': 2.0,
  'super-white-travertine': 2.0,
  'river-silver': 2.0,
  'silver-grey-travertine': 2.0,
  'brown-silver': 2.0,
  'titanium-silver': 2.0,
  'sbyss-black': 2.0,
  'golden-coast': 2.0,
  'classic-cloudy': 2.0,
  'classic-light': 2.0,
  'soft-rome': 2.0,
  'sivas-yellow': 2.0,
  'swamp-brown': 2.0,
  'antique-red': 2.0,
  'leonardo-travertine': 2.0,

  // Other marbles
  'volakas-white': 2.2,
  'light-emperador': 2.0,
  'dark-emperador': 2.0,
  'daino-reale': 2.0,
  'moca-cream-limestone': 2.0,
  'taj-mahal': 2.2,
  'elegant-grey': 2.0,
  'bianco-carrara': 2.2,
};
