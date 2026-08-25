// ============================================================
// EENHEID VAN ALLE BEDRAGEN IN DIT BESTAND
// ============================================================
// Alle basisprijzen en ondergrenzen hieronder staan EX BTW, zoals het atelier
// offreert. computeRange() telt de BTW er aan het eind bij op, omdat de
// configurator consumentenprijzen toont en die inclusief BTW horen te zijn.
// Voeg dus nooit zelf BTW toe aan een basisprijs.
export const VAT_RATE = 0.21;

// ============================================================
// PRICING CONFIG, PLACEHOLDER VALUES
// Replace the VUL_IN numbers with real figures from actual quotes.
// These drive the INDICATIVE RANGE shown in the configurator.
// The exact price is always determined per order via supplier quote.
// ============================================================

// Indicative starting price per stone, for the SMALLEST standard
// configuration in that stone (smallest size, 1 leg, polished).
// Source these from your real sent quotes later.
// EX BTW, voor het referentie-oppervlak van 2,0 m2.
// Afgeleid van de opgegeven vraagprijs: een travertijnen eettafel van
// 200 x 90 met twee poten kost 2.500 - 3.500 ex BTW, dus midden 3.000.
// Terugrekenen: (3.000 - 496 pootentoeslag) / 0,9 oppervlaktefactor = 2.782.
// Overige steensoorten liggen volgens het atelier op hetzelfde niveau als
// travertijn; Calacatta Viola is schaars en ligt hoger. Voor die verhouding
// is 1,5x aangehouden, gelijk aan die bij de salontafel (1.500 -> 2.250).
export const STONE_BASE_PRICE: Record<string, number> = {
  'classic-cloudy':  2782,   // travertijn
  'tiramisu':        2782,   // travertijn
  'light-emprador':  2782,   // marmer, gelijk prijspeil
  'dark-emperador':  2782,   // marmer, gelijk prijspeil
  'calacatta-viola': 4173,   // schaars premium marmer, afgeleid 1,5x
};

// How much the indicative price scales with surface area.
// Base size reference = 2.0 m² (e.g. 200x100cm).
// Larger tables scale up proportionally to surface area.
export const BASE_SURFACE_M2 = 2.0;          // reference surface
export const SURFACE_SCALING = 1.0;          // VUL_IN, 1.0 = linear with m²

// Surcharge per extra leg beyond the first (indicative).
export const EXTRA_LEG_SURCHARGE = 496;      // VUL_IN, per extra leg, ex BTW

// Finish surcharges (these you already know).
// Ex BTW.
export const FINISH_SURCHARGE: Record<string, number> = {
  gepolijst:  0,
  gezoet:     165,
  geborsteld: 124,
};

// ============================================
// SALONTAFEL (massieve sokkel / plinth)
// Een sokkel is een ander product dan een blad op een onderstel: kleiner
// oppervlak, maar veel meer steen per m2 en verstek gezaagde hoeken.
// Daarom een eigen basisprijs in plaats van de eettafelprijs schalen.
//
// LET OP: placeholders, net als de eettafelprijzen hierboven. Zet hier de
// werkelijke inkoopprijs x 3 (ex BTW) neer zodra die bekend is.
// Referentie: basisprijs geldt voor het standaardformaat 120 x 70 cm.
// ============================================
// EX BTW, zoals opgegeven door het atelier, voor het referentieformaat
// 120 x 70 cm. Grotere maten schalen mee met het oppervlak.
//   travertijn en overige steensoorten: 1.500
//   Calacatta Viola: 2.000 - 2.500; 2.250 is het midden van die range
// Controle tegen de opslagregel: viola inkoop 700 x 3 = 2.100 ex BTW.
export const PLINTH_BASE_PRICE: Record<string, number> = {
  'classic-cloudy':  1500,   // travertijn
  'tiramisu':        1500,   // travertijn
  'light-emprador':  1500,   // marmer, prijspeil gelijk aan travertijn
  'dark-emperador':  1500,   // marmer, prijspeil gelijk aan travertijn
  'calacatta-viola': 2250,   // schaars premium marmer
};
/** Referentie-oppervlak voor de sokkelprijs: 1,20 x 0,70 m. */
export const PLINTH_BASE_SURFACE_M2 = 0.84;

// ============================================
// BIJZETTAFEL (compact blok naast de bank)
// ============================================
// EX BTW, zoals opgegeven door het atelier, voor het referentieformaat
// 45 x 45 cm.
export const SIDE_TABLE_BASE_PRICE: Record<string, number> = {
  'classic-cloudy':  600,   // ex BTW
  'tiramisu':        600,   // ex BTW
  'light-emprador':  600,   // ex BTW
  'dark-emperador':  600,   // ex BTW
  'calacatta-viola': 1000,  // ex BTW
};

/** Referentieformaat voor de bijzettafel: 0,45 x 0,45 m. */
export const SIDE_TABLE_BASE_SURFACE_M2 = 0.2025;

/** Ondergrens voor de bijzettafel, om dezelfde reden als bij de sokkel. */
export const SIDE_TABLE_MIN_PRICE = 370;

// Ondergrens voor de sokkelprijs.
// De prijs schaalt mee met het oppervlak, maar een deel van de kosten doet dat
// niet: de white-glove levering is een vast bedrag, en verstek zagen en
// afwerken kosten bij een klein blok bijna evenveel tijd als bij een groot.
// Puur lineair schalen zou het instapmodel onder de kostprijs duwen.
// EX BTW. Dit is de onderkant van de bandbreedte, niet het midden.
export const PLINTH_MIN_PRICE = 740;

// Breedte van de getoonde bandbreedte rond het berekende midden.
// Een eettafel kent meer variabelen (onderstel, randprofiel, slabkeuze) en
// krijgt daarom een ruimere band: 200 x 90 travertijn komt daarmee uit op de
// opgegeven vraagprijs van 2.500 - 3.500 ex BTW.
export const RANGE_SPREAD = 0.12;            // sokkel en bijzettafel, ±12%
export const DINING_RANGE_SPREAD = 0.167;    // eettafel, ±16,7%

// ============================================================
// Calculation, do not edit below unless logic changes
// ============================================================

export interface PriceInput {
  /** Bepaalt welke basisprijs en welk referentieformaat gelden. */
  productType?: 'eettafel' | 'salontafel' | 'bijzettafel';
  stoneId: string;
  lengthMm: number;
  widthMm: number;
  legCount: number;
  finish: string;
}

export interface PriceRange {
  low: number;
  high: number;
  mid: number;
}

const roundTo = (n: number, step = 50) => Math.round(n / step) * step;

export const computeRange = (input: PriceInput): PriceRange => {
  const isSideTable = input.productType === 'bijzettafel';
  const isPlinth = isSideTable || input.productType === 'salontafel';

  const table = isSideTable
    ? SIDE_TABLE_BASE_PRICE
    : input.productType === 'salontafel'
      ? PLINTH_BASE_PRICE
      : STONE_BASE_PRICE;
  const base = table[input.stoneId] ?? table['classic-cloudy'];

  const referenceSurface = isSideTable
    ? SIDE_TABLE_BASE_SURFACE_M2
    : input.productType === 'salontafel'
      ? PLINTH_BASE_SURFACE_M2
      : BASE_SURFACE_M2;

  // surface in m² (mm → m)
  const surfaceM2 = (input.lengthMm / 1000) * (input.widthMm / 1000);
  const surfaceFactor = 1 + ((surfaceM2 - referenceSurface) / referenceSurface) * SURFACE_SCALING;

  // Een sokkel heeft geen poten; alleen een eettafel kent een pootentoeslag.
  const legCost = isPlinth ? 0 : Math.max(0, input.legCount - 1) * EXTRA_LEG_SURCHARGE;
  const finishCost = FINISH_SURCHARGE[input.finish] ?? 0;

  const scaled = base * Math.max(0.5, surfaceFactor) + legCost + finishCost;
  // De ondergrens geldt voor de onderkant van de bandbreedte, zodat het
  // laagste getoonde bedrag nooit onder het minimum zakt.
  const minPrice = isSideTable ? SIDE_TABLE_MIN_PRICE : PLINTH_MIN_PRICE;
  const midFloor = minPrice / (1 - RANGE_SPREAD);
  const mid = isPlinth ? Math.max(midFloor, scaled) : scaled;

  // De basisprijzen staan ex BTW; de configurator toont consumentenprijzen,
  // dus hier wordt de BTW toegevoegd.
  const withVat = (n: number) => roundTo(n * (1 + VAT_RATE));
  const spread = isPlinth ? RANGE_SPREAD : DINING_RANGE_SPREAD;

  return {
    low:  withVat(mid * (1 - spread)),
    high: withVat(mid * (1 + spread)),
    mid:  withVat(mid),
  };
};

// ============================================
// VANAF-PRIJS
// ============================================
// Berekend uit dezelfde prijsfunctie als de configurator zelf, zodat het
// getoonde vanaf-bedrag niet los kan gaan lopen van de werkelijke prijzen.
export const getEntryPrice = (
  productType: 'eettafel' | 'salontafel' | 'bijzettafel',
  smallest: { lengthMm: number; widthMm: number }
): number => {
  const stones = Object.keys(
    productType === 'bijzettafel'
      ? SIDE_TABLE_BASE_PRICE
      : productType === 'salontafel'
        ? PLINTH_BASE_PRICE
        : STONE_BASE_PRICE
  );
  const prices = stones.map(
    (stoneId) =>
      computeRange({
        productType,
        stoneId,
        lengthMm: smallest.lengthMm,
        widthMm: smallest.widthMm,
        legCount: 1,
        finish: 'gepolijst',
      }).low
  );
  return Math.min(...prices);
};
