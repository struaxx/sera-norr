export const tierStructure = {
  diningTables: {
    essenza: {
      name: "Essenza",
      priceFrom: 2950,
      description: "Travertijn of lichte marmers, klassieke onderstellen",
      stones: ["Travertijn Classico", "Light Emperador"],
      bases: ["Recht stalen onderstel", "Centrale kolom"],
    },
    signature: {
      name: "Signature",
      priceFrom: 4850,
      description: "Premium marmers, conische of bronzen poten",
      stones: ["Light Emperador", "Calacatta Viola", "Statuario"],
      bases: ["Conische marmer poten", "Bronzen onderstel", "Gegoten staal"],
    },
    atelier: {
      name: "Atelier Edition",
      priceFrom: 8200,
      description: "Statuario Extra, hand-finished, genummerd 1/12",
      stones: ["Statuario Extra"],
      bases: ["Gegoten bronzen voet"],
    },
  },
  coffeeTables: {
    essenza: {
      name: "Essenza",
      priceFrom: 1950,
      description: "Travertijn of lichte marmers, rechte onderstellen",
      stones: ["Travertijn Classico", "Light Emperador"],
      bases: ["Recht stalen frame", "Massieve marmer voet"],
    },
    signature: {
      name: "Signature",
      priceFrom: 3200,
      description: "Calacatta Viola of premium marmers, geselecteerde poten",
      stones: ["Calacatta Viola", "Statuario", "Nero Marquina"],
      bases: ["Conische marmer poten", "Brons", "Premium staal"],
    },
    atelier: {
      name: "Atelier Edition",
      priceFrom: 5500,
      description: "Statuario Extra, hand-finished, genummerd 1/12",
      stones: ["Statuario Extra"],
      bases: ["Gegoten bronzen voet"],
    },
  },
} as const;

export type TierKey = "essenza" | "signature" | "atelier";
export type CategoryKey = keyof typeof tierStructure;
