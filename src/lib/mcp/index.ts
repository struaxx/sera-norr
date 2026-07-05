import { defineMcp } from "@lovable.dev/mcp-js";
import listStones from "./tools/list-stones";
import getAtelierInfo from "./tools/get-atelier-info";
import submitContactRequest from "./tools/submit-contact-request";

export default defineMcp({
  name: "sera-norr-mcp",
  title: "SERA NORR Atelier",
  version: "0.1.0",
  instructions:
    "Tools for the SERA NORR digital bespoke atelier (natural stone furniture). Use `list_stones` to browse the travertine and marble catalog, `get_atelier_info` for contact details, lead time and starting prices, and `submit_contact_request` to send a bespoke or general inquiry to the atelier team.",
  tools: [listStones, getAtelierInfo, submitContactRequest],
});