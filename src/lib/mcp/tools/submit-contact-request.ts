import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export default defineTool({
  name: "submit_contact_request",
  title: "Submit contact request",
  description:
    "Submit a contact / bespoke inquiry to the SERA NORR atelier. The team follows up by email within 1–2 business days.",
  inputSchema: {
    email: z.string().email().describe("Contact email of the person making the request."),
    name: z.string().min(1).max(100).optional().describe("Full name."),
    phone: z.string().max(50).optional().describe("Phone number (optional)."),
    subject: z
      .enum(["algemeen", "maatwerk", "samenwerking"])
      .optional()
      .describe("Subject category: general question, bespoke, or partnership."),
    message: z.string().min(1).max(5000).describe("The message / inquiry content."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  handler: async ({ email, name, phone, subject, message }) => {
    const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
    const url = env.SUPABASE_URL;
    const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      return {
        content: [{ type: "text", text: "Backend not configured." }],
        isError: true,
      };
    }
    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("form_submissions")
      .insert({
        form_type: "contact",
        email: email.toLowerCase().trim(),
        name: name ?? null,
        phone: phone ?? null,
        subject: subject ?? "algemeen",
        message,
        metadata: { source: "mcp" },
      })
      .select("id")
      .single();
    if (error) {
      return {
        content: [{ type: "text", text: `Failed to submit: ${error.message}` }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `Contact request received. The SERA NORR atelier will reply by email within 1–2 business days.`,
        },
      ],
      structuredContent: { id: data.id, status: "received" },
    };
  },
});