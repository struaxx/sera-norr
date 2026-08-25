// ============================================================
// PRICING CONFIG, PLACEHOLDER VALUES
// Replace the VUL_IN numbers with real figures from actual quotes.
// These drive the INDICATIVE RANGE shown in the configurator.
// The exact price is always determined per order via supplier quote.
// ============================================================

// Indicative starting price per stone, for the SMALLEST standard
// configuration in that stone (smallest size, 1 leg, polished).
// Source these from your real sent quotes later.
export const STONE_BASE_PRICE: Record<string, number> = {
  'classic-cloudy':  2950,   // VUL_IN, travertijn, goedkoopst
  'tiramisu':        2950,   // VUL_IN, travertijn
  'light-emprador':  3800,   // VUL_IN, marmer
  'dark-emperador':  3800,   // VUL_IN, marmer
  'calacatta-viola': 4500,   // VUL_IN, premium marmer, duurst
};

// How much the indicative price scales with surface area.
// Base size reference = 2.0 m² (e.g. 200x100cm).
// Larger tables scale up proportionally to surface area.
export const BASE_SURFACE_M2 = 2.0;          // reference surface
export const SURFACE_SCALING = 1.0;          // VUL_IN, 1.0 = linear with m²

// Surcharge per extra leg beyond the first (indicative).
export const EXTRA_LEG_SURCHARGE = 600;      // VUL_IN, per extra leg

// Finish surcharges (these you already know).
export const FINISH_SURCHARGE: Record<string, number> = {
  gepolijst:  0,
  gezoet:     200,
  geborsteld: 150,
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
// Verkoopprijzen zoals opgegeven door het atelier, inclusief BTW, geldend
// voor het referentieformaat 120 x 70 cm. Grotere maten schalen mee met het
// oppervlak.
//   travertijn en overige steensoorten: circa 1.500
//   Calacatta Viola: 2.000 - 2.500 (schaars, hoge vraag)
// Ter controle tegen de vaste opslagregel (inkoop x 3, daarna BTW):
// Viola inkoop 700 -> 2.100 ex BTW -> 2.541 incl, wat binnen die range valt.
// De basiswaarde 2.250 laat de configurator precies 2.000 - 2.500 tonen.
export const PLINTH_BASE_PRICE: Record<string, number> = {
  'classic-cloudy':  1500,   // travertijn
  'tiramisu':        1500,   // travertijn
  'light-emprador':  1500,   // marmer, prijspeil gelijk aan travertijn
  'dark-emperador':  1500,   // marmer, prijspeil gelijk aan travertijn
  'calacatta-viola': 2250,   // schaars premium marmer
};
/** Referentie-oppervlak voor de sokkelprijs: 1,20 x 0,70 m. */
export const PLINTH_BASE_SURFACE_M2 = 0.84;

// Ondergrens voor de sokkelprijs.
// De prijs schaalt mee met het oppervlak, maar een deel van de kosten doet dat
// niet: de white-glove levering is een vast bedrag, en verstek zagen en
// afwerken kosten bij een klein blok bijna evenveel tijd als bij een groot.
// Puur lineair schalen zou het instapmodel onder de kostprijs duwen.
// AANPASBAAR: zet hier het laagste bedrag waarvoor een kleine sokkel nog uit
// kan, inclusief BTW en inclusief levering. Dit is het laagste bedrag dat een
// bezoeker te zien krijgt, niet het midden van de bandbreedte.
export const PLINTH_MIN_PRICE = 895;

// Range width: the indicative range is shown as [low, high] around
// the computed midpoint. E.g. 0.12 = ±12%.
export const RANGE_SPREAD = 0.12;            // VUL_IN, ±12%

// ============================================================
// Calculation, do not edit below unless logic changes
// ============================================================

export interface PriceInput {
  /** 'salontafel' rekent met de sokkel-basisprijs. */
  productType?: 'eettafel' | 'salontafel';
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
  const isPlinth = input.productType === 'salontafel';

  const base = isPlinth
    ? PLINTH_BASE_PRICE[input.stoneId] ?? PLINTH_BASE_PRICE['classic-cloudy']
    : STONE_BASE_PRICE[input.stoneId] ?? STONE_BASE_PRICE['classic-cloudy'];

  const referenceSurface = isPlinth ? PLINTH_BASE_SURFACE_M2 : BASE_SURFACE_M2;

  // surface in m² (mm → m)
  const surfaceM2 = (input.lengthMm / 1000) * (input.widthMm / 1000);
  const surfaceFactor = 1 + ((surfaceM2 - referenceSurface) / referenceSurface) * SURFACE_SCALING;

  // Een sokkel heeft geen poten; alleen een eettafel kent een pootentoeslag.
  const legCost = isPlinth ? 0 : Math.max(0, input.legCount - 1) * EXTRA_LEG_SURCHARGE;
  const finishCost = FINISH_SURCHARGE[input.finish] ?? 0;

  const scaled = base * Math.max(0.5, surfaceFactor) + legCost + finishCost;
  // De ondergrens geldt voor de onderkant van de bandbreedte, zodat het
  // laagste getoonde bedrag nooit onder het minimum zakt.
  const midFloor = PLINTH_MIN_PRICE / (1 - RANGE_SPREAD);
  const mid = isPlinth ? Math.max(midFloor, scaled) : scaled;

  return {
    low:  roundTo(mid * (1 - RANGE_SPREAD)),
    high: roundTo(mid * (1 + RANGE_SPREAD)),
    mid:  roundTo(mid),
  };
};

// ============================================
// VANAF-PRIJS
// ============================================
// Berekend uit dezelfde prijsfunctie als de configurator zelf, zodat het
// getoonde vanaf-bedrag niet los kan gaan lopen van de werkelijke prijzen.
export const getEntryPrice = (
  productType: 'eettafel' | 'salontafel',
  smallest: { lengthMm: number; widthMm: number }
): number => {
  const stones = Object.keys(
    productType === 'salontafel' ? PLINTH_BASE_PRICE : STONE_BASE_PRICE
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
