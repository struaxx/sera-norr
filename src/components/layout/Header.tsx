import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { FoundersBanner } from "@/components/FoundersBanner";

export function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if on homepage (transparent header with hero)
  const isHomePage = location.pathname === "/";

  // Simplified navigation: Collecties · Over · [Ontwerp uw tafel CTA]
  const desktopNavLinks = [
    { name: t('nav.collections'), path: "/collections" },
    { name: t('nav.about', 'Over'), path: "/over" },
  ];

  const mobileNavLinks = [
    { name: t('nav.collections'), path: "/collections" },
    { name: t('nav.atelier', 'Atelier'), path: "/atelier" },
    { name: t('nav.about', 'Over'), path: "/over" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Determine text color: white on homepage hero (not scrolled), dark otherwise
  const isLightText = isHomePage && !isScrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled
            ? "bg-background/95 backdrop-blur-sm"
            : "bg-transparent"
        )}
      >
        <FoundersBanner />
        {isLightText && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[var(--banner-h,0px)] bg-gradient-to-b from-foreground/78 via-foreground/42 to-transparent" />
        )}

        <nav className={cn(
          "relative z-10 container mx-auto px-6 lg:px-12 flex items-center justify-between",
          isScrolled ? "py-4" : "py-6 lg:py-8"
        )}>
          {/* Left Navigation */}
          <div className="hidden lg:flex lg:flex-1 items-center gap-10">
            {desktopNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 link-underline",
                  isLightText
                    ? "text-background/90 hover:text-background"
                    : location.pathname === link.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Left spacer for mobile centering */}
          <div className="flex-1 lg:hidden" />

          {/* Logo */}
          <Link
            to="/"
            className={cn(
              "relative isolate font-serif text-xl lg:text-2xl tracking-[0.15em] transition-colors duration-300",
              isLightText
                ? "text-background [text-shadow:0_2px_14px_hsl(var(--foreground)/0.75)] before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:h-10 before:w-[calc(100%+3.5rem)] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[radial-gradient(ellipse_at_center,hsl(var(--foreground)/0.48)_0%,hsl(var(--foreground)/0.26)_52%,transparent_78%)] before:blur-lg"
                : "text-foreground"
            )}
          >
            SERA NORR
          </Link>

          {/* Right Navigation with sticky CTA */}
          <div className="hidden lg:flex lg:flex-1 items-center justify-end gap-8">
            <LanguageSwitcher isLight={isLightText} />
            
            {/* Sticky Atelier CTA */}
            <Button 
              asChild 
              variant={isLightText ? "outline" : "sera-primary"}
              size="sm"
              className={cn(
                "h-9 px-4 text-[11px] uppercase tracking-[0.1em]",
                isLightText && "border-background/50 text-background hover:bg-background hover:text-foreground"
              )}
            >
              <Link to="/atelier">
                {t('nav.designCta', 'Ontwerp uw tafel')}
                <ArrowRight className="ml-1.5 h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="lg:hidden flex flex-1 items-center justify-end gap-3">
            <LanguageSwitcher isLight={isLightText} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "p-2 -mr-2 transition-colors duration-300",
                isLightText ? "text-background" : "text-foreground"
              )}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {mobileNavLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-serif text-3xl tracking-wide transition-all duration-500",
                isMobileMenuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
                location.pathname === link.path
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}