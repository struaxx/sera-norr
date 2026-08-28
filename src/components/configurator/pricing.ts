// ============================================================
// EENHEID VAN ALLE BEDRAGEN IN DIT BESTAND
// ============================================================
// Alle basisprijzen en ondergrenzen hieronder staan EX BTW, zoals het atelier
// offreert. computeRange() telt de BTW er aan het eind bij op, omdat de
// configurator consumentenprijzen toont en die inclusief BTW horen te zijn.
// Voeg dus nooit zelf BTW toe aan een basisprijs.
export const VAT_RATE = 0.21;

// ============================================================
// EETTAFEL, BASISPRIJZEN PER STEENSOORT
// ============================================================
// Deze bedragen komen uit werkelijke inkoopprijzen van het atelier, maal drie,
// ex BTW. De referentieconfiguratie waarop ze gelden:
//
//     2,0 m2 blad (bijv. 2000 x 1000), 36 mm dik
//     twee cilindrische poten
//     gepolijst
//
// Opgegeven inkoop voor die maat, gezoet en geimpregneerd:
//     tiramisu travertijn  1.200  ->  3.600 verkoop  ->  3.435 zonder zoettoeslag
//     dark emperador       1.100  ->  3.300 verkoop  ->  3.135
//     light emperador        950  ->  2.850 verkoop  ->  2.685
//
// De steensoorten liggen dus NIET op hetzelfde niveau; tussen light emperador
// en tiramisu zit 750 euro. Eerder stonden ze hier alle vier op een en hetzelfde
// bedrag, waardoor de configurator voor drie verschillende stenen dezelfde prijs
// gaf.
export const STONE_BASE_PRICE: Record<string, number> = {
  'tiramisu':        3435,   // travertijn, uit opgegeven inkoop 1.200
  'classic-cloudy':  3435,   // travertijn, zelfde prijspeil als tiramisu
  'dark-emperador':  3135,   // marmer, uit opgegeven inkoop 1.100
  'light-emprador':  2685,   // marmer, uit opgegeven inkoop 950
  // NOG TE BEVESTIGEN: voor Calacatta Viola is geen eettafelprijs opgegeven.
  // Hier staat 1,5x tiramisu, dezelfde verhouding als bij de salontafel
  // (1.500 -> 2.250). Vervang zodra de werkelijke inkoop bekend is.
  'calacatta-viola': 5153,
};

/** Referentie-oppervlak waarop STONE_BASE_PRICE geldt. */
export const BASE_SURFACE_M2 = 2.0;
export const SURFACE_SCALING = 1.0;          // 1.0 = lineair met m2

// De basisprijs geldt voor twee poten, want zo worden deze tafels geoffreerd.
// Een derde poot bij lange bladen kost extra, een enkele poot scheelt evenveel.
export const EXTRA_LEG_SURCHARGE = 496;      // per poot boven of onder de twee
export const REFERENCE_LEG_COUNT = 2;

// ============================================================
// POOTSTIJL
// ============================================================
// Een opgegeven tafel van 2200 x 900 (1,98 m2, dus praktisch hetzelfde
// oppervlak als de referentie) met twee ZANDLOPERPOTEN kwam op 2.550 inkoop,
// oftewel 7.650 verkoop. Dat is ruim tweemaal de prijs van dezelfde maat met
// cilindrische poten. Bij gelijk oppervlak kan dat verschil niet uit de maat
// komen; het zit in de pootstijl, de steensoort, of allebei. Welke steen het
// betrof is niet opgegeven, dus het is nog niet toe te rekenen.
//
// De structuur staat er alvast. Zolang de bedragen op nul staan rekent de
// configurator elke pootstijl als cilindrisch, wat voor de duurdere stijlen
// een te lage indicatie geeft.
export const LEG_STYLE_SURCHARGE: Record<string, number> = {
  cilindrisch:  0,   // referentiestijl
  gecanneleerd: 0,   // NOG IN TE VULLEN
  conisch:      0,   // NOG IN TE VULLEN
  zandloper:    0,   // NOG IN TE VULLEN, ligt fors hoger
  'v-poten':    0,   // NOG IN TE VULLEN
  'd-poten':    0,   // NOG IN TE VULLEN
};

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
  /** Pootstijl; bepaalt de toeslag uit LEG_STYLE_SURCHARGE. */
  legStyle?: string;
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
  // De basisprijs geldt voor twee poten; afwijken kost of scheelt per poot.
  const legCost = isPlinth
    ? 0
    : (input.legCount - REFERENCE_LEG_COUNT) * EXTRA_LEG_SURCHARGE;
  const legStyleCost = isPlinth ? 0 : (LEG_STYLE_SURCHARGE[input.legStyle ?? ''] ?? 0);
  const finishCost = FINISH_SURCHARGE[input.finish] ?? 0;

  const scaled = base * Math.max(0.5, surfaceFactor) + legCost + legStyleCost + finishCost;
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
        legCount: productType === 'eettafel' ? 2 : 1,
        finish: 'gepolijst',
      }).low
  );
  return Math.min(...prices);
};

/**
 * Het laagste bedrag waarvoor het atelier iets levert: de kleinste
 * bijzettafel in de goedkoopste steen.
 *
 * Overal op de site waar "al vanaf" staat hoort dit getal te staan. Voorheen
 * noemden de startpagina (1.950), een journalartikel (1.950 en 2.950) en de
 * configurator elk een ander bedrag; wie op de hoogste klikte en de laagste
 * zag, of andersom, kreeg terecht het gevoel dat er iets niet klopte.
 */
export const SITE_ENTRY_PRICE = getEntryPrice('bijzettafel', {
  lengthMm: 350,
  widthMm: 350,
});

/** Als tekst, in Nederlandse notatie: "450". */
export const formatEuro = (n: number) => n.toLocaleString('nl-NL');
