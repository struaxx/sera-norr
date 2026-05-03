import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/31600000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Stuur ons een WhatsApp bericht"
      title="Chat via WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ backgroundColor: "#25D366" }}
    >
      <MessageCircle className="h-7 w-7 text-white" strokeWidth={2} />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded bg-foreground px-3 py-1.5 text-xs font-sans text-background opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100">
        Chat via WhatsApp
      </span>
    </a>
  );
}