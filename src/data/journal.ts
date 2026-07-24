// Journal articles — data-driven so the list page and the article detail page
// render from one source. Body is authored as typed blocks (no raw HTML) so it
// stays styleable and safe to render.

export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export interface JournalArticle {
  slug: string;
  category: "materials" | "care" | "interiors" | "craftsmanship";
  /** ISO date, e.g. "2026-07-01" */
  date: string;
  /** Estimated reading time in minutes */
  readTime: number;
  title: string;
  excerpt: string;
  metaDescription: string;
  blocks: ArticleBlock[];
}

export const journalArticles: JournalArticle[] = [
  {
    slug: "travertijn-of-marmer-eettafel",
    category: "materials",
    date: "2026-07-01",
    readTime: 6,
    title: "Travertijn of marmer voor uw natuurstenen tafel",
    excerpt:
      "Travertijn of marmer voor uw natuurstenen eettafel? Een vergelijking van uiterlijk en onderhoud, en van wat de prijs bepaalt.",
    metaDescription:
      "Twijfelt u tussen travertijn en marmer voor een natuurstenen tafel? Lees hoe ze verschillen in uiterlijk en onderhoud, en wat de prijs bepaalt.",
    blocks: [
      {
        type: "p",
        text: "U twijfelt tussen travertijn en marmer voor een natuurstenen tafel. Beide hebben een natuurlijke uitstraling en beide vragen wat meer aandacht dan een blad van hout of kunststof. Waar ze in verschillen — uiterlijk, onderhoud en prijs — bepaalt welke bij u past.",
      },
      { type: "h2", text: "Verwant, maar niet hetzelfde gesteente" },
      {
        type: "p",
        text: "Travertijn en marmer bestaan hoofdzakelijk uit calciumcarbonaat, in de vorm van het mineraal calciet. Marmer is metamorf gesteente: kalksteen die onder druk en warmte is omgevormd tot een dichtere steen. Travertijn ontstaat anders. Het slaat neer uit kalkrijk bron- of grondwater, vaak bij warmwaterbronnen. Geologisch is het dus geen echt marmer, ook al noemt de handel het soms zo.",
      },
      {
        type: "p",
        text: "Het praktische verschil zit in de structuur. Travertijn is poreus en heeft karakteristieke holtes en gaatjes, ontstaan tijdens de vorming door ontsnappende gasbellen en vergane resten. Die holtes lopen evenwijdig aan de afzettingslagen; vandaar het gestreepte uiterlijk. Voor een tafelblad wordt travertijn daarom vaak gevuld geleverd: de open cellen worden opgevuld met hars of cement en het blad wordt gezoet of gepolijst. Bij ongevulde varianten blijven de gaten open. Dat oogt rauwer, maar houdt kruimels en vocht vast, en een vulling kan na jaren loslaten.",
      },
      { type: "h2", text: "Ingetogen of uitgesproken" },
      {
        type: "p",
        text: "Niet iedereen wil een tafel die de hele kamer opeist. Travertijn heeft een rustige, warme uitstraling in aardetinten: beige, crème, ivoor, taupe, tot bruin toe. In de configurator van SERA NORR zijn dat Classic Cloudy en Tiramisu. Zulke stenen ogen kalmer dan sterk geaderd marmer.",
      },
      {
        type: "p",
        text: "Bij marmer loopt het uiteen. Lichtere, gelijkmatig geaderde soorten blijven ingetogen: Light Emperador is warm bruin met een onregelmatige adering, Statuario helder wit met grijze en soms goudbeige aders. Aan de andere kant staat Calacatta Viola: paarse tot bordeauxrode aders op een lichte ondergrond, vaak met goud, groen en roestrood erin. Dat contrast is bewust. De donkere aders steken sterk af tegen de lichte achtergrond, wat zo'n blad tot een blikvanger maakt.",
      },
      {
        type: "p",
        text: "Zoekt u rust, dan volstaat travertijn of een licht marmer. Wilt u een pronkstuk, dan is Calacatta Viola de keuze — zeldzaam, uit beperkte groeven, en daardoor fors duurder dan de gangbare soorten.",
      },
      { type: "h2", text: "Waar u bij het gebruik op let" },
      {
        type: "p",
        text: "In het gebruik lijken de twee sterk op elkaar; het is allebei kalksteenachtig materiaal. Twee dingen zijn belangrijk: de steen is relatief zacht en gevoelig voor zuur. De hardheid ligt rond 3 tot 4 op de schaal van Mohs — calciet zelf zit op 3. Dat is duidelijk zachter dan graniet of kwartscomposiet, dus zand, keramiek of staal kunnen krassen. Belangrijker nog is het etsen. Calciumcarbonaat reageert met zuur, waardoor doffe plekken ontstaan. Citroensap, azijn, wijn, cola, tomaat en ontkalker doen dat, soms al binnen enkele minuten.",
      },
      {
        type: "quote",
        text: "Etsen is geen vlek maar een aantasting van het oppervlak zelf. Een impregneermiddel houdt vlekken tegen, maar geen etsplekken.",
      },
      {
        type: "p",
        text: "Door de poreuze structuur trekken vloeistoffen ook in. Olie, wijn, koffie en thee kunnen verkleuringen geven; olie laat een donkere vlek na. Travertijn neemt daarbij meer op dan marmer. In de praktijk komt het neer op een paar gewoonten:",
      },
      {
        type: "list",
        items: [
          "Reinig met een pH-neutrale, niet-zure reiniger. Geen azijn, citroen, schuurmiddel of bleek.",
          "Neem gemorst vocht snel op in plaats van uit te vegen, zeker bij zuur of vet.",
          "Gebruik onderzetters en onderleggers; die beperken ets- en krasschade.",
          "Impregneer periodiek. Dat houdt vlekken tegen, niet het etsen. Hoe vaak, hangt af van het product, de afwerking en het gebruik.",
        ],
      },
      {
        type: "p",
        text: "De afwerking maakt hierin veel uit. Op een gepolijst, glanzend blad valt een etsplek op door lokaal glansverlies; op een gezoet, mat blad zie je het veel minder. Daarom kiezen veel mensen voor travertijn een gezoete afwerking, en kan mat marmer voor dagelijks gebruik prettiger zijn dan hoogglans.",
      },
      { type: "h2", text: "Waarom een natuurstenen eettafel zoveel kost" },
      {
        type: "p",
        text: "Een natuurstenen eettafel is een flinke uitgave. Het helpt om te weten waar dat geld heen gaat: de prijs wordt vooral bepaald door het materiaal, het gewicht en het handwerk.",
      },
      {
        type: "list",
        items: [
          "De plaat zelf. De steen is de grootste materiaalkost, en de prijs per vierkante meter verschilt enorm per soort. Zeldzame stenen uit beperkte groeven, zoals Calacatta Viola, kosten een veelvoud van de gangbare soorten.",
          "Verlies bij het zagen. Natuursteen wordt per hele plaat verkocht; vaak neemt u de volledige plaat af, ook als u maar een deel gebruikt. Bij rond of vormgezaagd werk, en bij het zagen rond scheuren en adering, blijft een aanzienlijk deel over als onbruikbare rest. Bookmatching, waarbij de adering over twee bladen spiegelt, verdubbelt de materiaalkost.",
          "Gewicht. Marmer en travertijn wegen rond 2.700 kilo per kubieke meter. Een blad van 3 centimeter weegt zo'n 80 kilo per vierkante meter; een tafelblad van 2 bij 1 meter zit al snel rond 150 kilo. Dat vraagt een stevig — en dus prijzig — onderstel.",
          "Bewerking. Randprofielen, polijsten of zoeten, impregneren en het wegwerken van natuurlijke oneffenheden kosten tijd. Een verstek gezaagde rand die een dik blad suggereert vraagt extra materiaal en precisie om de naad onzichtbaar te maken.",
          "Transport en plaatsing. Het materiaal is zwaar en breekbaar; platen gaan rechtop in speciale frames, en een gescheurd blad is bijna altijd totaalverlies, want onzichtbaar herstel kan niet. Bezorgen als pakket of door één persoon is uitgesloten.",
        ],
      },
      {
        type: "p",
        text: "Die laatste stap — bezorging tot in huis, uitpakken, plaatsen en verzekerd vervoer — kan een flink deel van de eindprijs uitmaken. Bij SERA NORR is dat, samen met transport en plaatsing, bij de prijs inbegrepen. Salontafels beginnen vanaf 1.950 euro en eettafels vanaf 2.950 euro; een zeldzame steen als Calacatta Viola ligt daar fors boven. De actuele prijs voor een specifieke steen en maat ziet u direct in de configurator.",
      },
    ],
  },
];

export const getArticleBySlug = (slug: string): JournalArticle | undefined =>
  journalArticles.find((a) => a.slug === slug);
