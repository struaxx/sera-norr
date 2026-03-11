import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";

export function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if on homepage (transparent header with hero)
  const isHomePage = location.pathname === "/";

  // Updated navigation: Collecties, Atelier (replaces Bespoke), Contact
  const navLinks = [
    { name: t('nav.collections'), path: "/lookbook" },
    { name: "Atelier", path: "/atelier" },
    { name: t('nav.contact'), path: "/contact" },
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
            ? "bg-background/95 backdrop-blur-sm py-4"
            : "bg-transparent py-6 lg:py-8"
        )}
      >
        <nav className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Left Navigation */}
          <div className="hidden lg:flex lg:flex-1 items-center gap-10">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 link-underline",
                  isLightText
                    ? "text-white/80 hover:text-white"
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
              "font-serif text-xl lg:text-2xl tracking-[0.15em] transition-colors duration-300",
              isLightText ? "text-white" : "text-foreground"
            )}
          >
            SERA NORR
          </Link>

          {/* Right Navigation with sticky CTA */}
          <div className="hidden lg:flex lg:flex-1 items-center justify-end gap-8">
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 link-underline",
                  isLightText
                    ? "text-white/80 hover:text-white"
                    : location.pathname === link.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            <LanguageSwitcher isLight={isLightText} />
            
            {/* Sticky Atelier CTA */}
            <Button 
              asChild 
              variant={isLightText ? "outline" : "sera-primary"}
              size="sm"
              className={cn(
                "h-9 px-4 text-[11px] uppercase tracking-[0.1em]",
                isLightText && "border-white/40 text-white hover:bg-white hover:text-foreground"
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
                isLightText ? "text-white" : "text-foreground"
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
          {navLinks.map((link, index) => (
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