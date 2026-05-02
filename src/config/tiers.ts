export const tierStructure = {
  diningTables: {
    essenza: {
      name: "Essenza",
      priceFrom: 3000,
      description: "Travertijn of lichte marmers, klassieke onderstellen",
      stones: ["Travertijn Classico", "Light Emperador"],
      bases: ["Recht stalen onderstel", "Centrale kolom"],
    },
    signature: {
      name: "Signature",
      priceFrom: 3500,
      description: "Premium marmers, conische of bronzen poten",
      stones: ["Light Emperador", "Calacatta Viola", "Statuario"],
      bases: ["Conische marmer poten", "Bronzen onderstel", "Gegoten staal"],
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
      priceFrom: 2500,
      description: "Calacatta Viola of premium marmers, geselecteerde poten",
      stones: ["Calacatta Viola", "Statuario", "Nero Marquina"],
      bases: ["Conische marmer poten", "Brons", "Premium staal"],
    },
  },
} as const;

export type TierKey = "essenza" | "signature";
export type CategoryKey = keyof typeof tierStructure;
