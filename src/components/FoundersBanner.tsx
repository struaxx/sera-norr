import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "foundersBannerClosed";

export function FoundersBanner() {
  const { i18n } = useTranslation();
  const isNL = i18n.language === "nl";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) !== "true") {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <div className="relative z-[60] bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-12 py-2.5 flex items-center justify-center gap-4">
        <Link
          to="/founders"
          className="group inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.18em] hover:opacity-80 transition-opacity text-center"
        >
          <span>
            {isNL
              ? "Founders, 25% korting voor de eerste 12 klanten"
              : "Founders, 25% off for the first 12 clients"}
          </span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <button
          type="button"
          onClick={handleClose}
          aria-label={isNL ? "Sluit banner" : "Close banner"}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
