import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_atelier_info",
  title: "Get atelier info",
  description:
    "Return SERA NORR contact and atelier information: phone, email, website, lead time and pricing starting points.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      name: "SERA NORR",
      tagline: "Digital bespoke atelier — natural stone furniture",
      phone: "+31 6 83 99 11 58",
      email: "info@sera-norr.com",
      website: "https://sera-norr.com",
      leadTimeWeeks: "12–16",
      startingPrices: {
        diningTables: "from €3,000",
        coffeeTables: "from €1,950",
        currency: "EUR",
        note: "Prices shown are starting (vanaf) prices. Final price depends on stone, size and finish.",
      },
      languages: ["nl", "en"],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});