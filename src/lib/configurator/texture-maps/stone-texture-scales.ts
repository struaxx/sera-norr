// ============================================
// Stone Texture Scales
// ============================================
// Per-stone UV scale tuning (repeat is calculated in TableMesh)

export const DEFAULT_TEXTURE_SCALE = 0.6;

export const STONE_TEXTURE_SCALES: Record<string, number> = {
  // Bold veining - larger scale
  'calacatta-viola': 0.8,
  'calacatta-vagli': 0.8,
  'arabescato-corchia': 0.8,
  'panda-white': 0.8,
  'grand-antique': 0.8,
  'calacatta-rosa': 0.8,
  'london-smoke': 0.9,
  'nero-marquina': 0.9,
  'verde-alpi': 0.9,

  // Travertines - moderate scale for pores
  'ivory': 0.6,
  'cream-travertine': 0.6,
  'light-cream-travertine': 0.6,
  'tiramisu': 0.7,
  'gore-gray': 0.6,
  'super-white-travertine': 0.6,
  'river-silver': 0.6,
  'silver-grey-travertine': 0.6,
  'brown-silver': 0.6,
  'titanium-silver': 0.7,
  'sbyss-black': 0.7,
  'golden-coast': 0.6,
  'classic-cloudy': 0.6,
  'classic-light': 0.6,
  'soft-rome': 0.6,
  'sivas-yellow': 0.6,
  'swamp-brown': 0.6,
  'antique-red': 0.7,
  'leonardo-travertine': 0.6,

  // Other marbles - moderate
  'volakas-white': 0.7,
  'light-emperador': 0.7,
  'dark-emperador': 0.7,
  'daino-reale': 0.7,
  'moca-cream-limestone': 0.6,
  'taj-mahal': 0.7,
  'elegant-grey': 0.7,
  'bianco-carrara': 0.7,
};
