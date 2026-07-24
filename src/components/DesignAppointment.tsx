import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import { trackDesignAppointmentClick } from "@/lib/analytics";

// Design-afspraak: het persoonlijke verkoopkanaal naast de zelfservice-
// configurator. Bewust geen samples-belofte — het gesprek zelf is het aanbod.

const WHATSAPP_NUMBER = "31683991158";

const waLink = (isNL: boolean) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    isNL
      ? "Hallo, ik wil graag een gratis design-afspraak plannen voor een tafel op maat."
      : "Hello, I would like to schedule a free design consultation for a bespoke table."
  )}`;

interface DesignAppointmentProps {
  isNL: boolean;
  /** Waar het blok staat, voor analytics (bijv. 'configurator', 'homepage'). */
  source: string;
  className?: string;
}

/**
 * Compact blok: "Liever persoonlijk advies?" — voor naast/onder de
 * configurator en op andere plekken waar het een sectie moet aanvullen.
 */
export function DesignAppointmentBlock({ isNL, source, className = "" }: DesignAppointmentProps) {
  return (
    <div className={`border border-sera-text-soft/20 rounded-sm p-6 md:p-8 ${className}`}>
      <span className="block text-[11px] uppercase tracking-[0.15em] text-sera-text-soft mb-3">
        {isNL ? "Liever persoonlijk advies?" : "Prefer personal advice?"}
      </span>
      <h3 className="font-serif text-2xl text-sera-text mb-2">
        {isNL ? "Plan een gratis design-afspraak" : "Book a free design consultation"}
      </h3>
      <p className="text-sm text-sera-text-soft leading-relaxed mb-5 max-w-md">
        {isNL
          ? "20 minuten, via video of telefoon. Bespreek uw interieur, wensen en budget met ons atelier — wij denken mee over steen, vorm en formaat. Vrijblijvend."
          : "20 minutes, by video or phone. Discuss your interior, wishes and budget with our atelier — we advise on stone, shape and size. No obligations."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={waLink(isNL)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackDesignAppointmentClick(source, "whatsapp")}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sera-surface text-sera-inverted hover:bg-sera-text text-xs uppercase tracking-[0.15em] rounded-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          {isNL ? "Plan via WhatsApp" : "Book via WhatsApp"}
        </a>
        <Link
          to="/contact?subject=design-afspraak"
          onClick={() => trackDesignAppointmentClick(source, "form")}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-sera-text-soft/30 text-sera-text hover:border-sera-surface text-xs uppercase tracking-[0.15em] rounded-sm transition-colors"
        >
          {isNL ? "Liever per e-mail" : "Prefer e-mail"}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
