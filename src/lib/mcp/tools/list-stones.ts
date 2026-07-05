import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { STONE_LIBRARY } from "@/lib/configurator/stone-library";

export default defineTool({
  name: "list_stones",
  title: "List stones",
  description:
    "List the natural stone catalog offered by SERA NORR (travertine and marble). Optionally filter by family, collection, or tier.",
  inputSchema: {
    family: z.enum(["travertine", "marble"]).optional().describe("Filter by stone family."),
    collection: z.enum(["terra", "vanta", "core"]).optional().describe("Filter by collection."),
    tier: z.enum(["signature", "atelier", "icon"]).optional().describe("Filter by tier."),
    activeOnly: z
      .boolean()
      .optional()
      .describe("If true, only return stones currently active in the 3D configurator."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ family, collection, tier, activeOnly }) => {
    const items = STONE_LIBRARY.filter(
      (s) =>
        (!family || s.family === family) &&
        (!collection || s.collection === collection) &&
        (!tier || s.tier === tier) &&
        (!activeOnly || s.isActiveInConfigurator),
    ).map((s) => ({
      id: s.id,
      name: s.name,
      family: s.family,
      collection: s.collection,
      tier: s.tier,
      finishOptions: s.finishOptions,
      description: s.shortDescription,
      characterTags: s.characterTags,
    }));
    return {
      content: [{ type: "text", text: `Found ${items.length} stones.\n\n${JSON.stringify(items, null, 2)}` }],
      structuredContent: { count: items.length, stones: items },
    };
  },
});