import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Instagram, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-serif text-2xl tracking-[0.15em] text-foreground">
              SERA NORR
            </Link>
            <p className="mt-6 max-w-md text-muted-foreground text-body-md leading-relaxed">
              {t('footer.tagline')}
            </p>
            
            {/* Contact info */}
            <div className="mt-6 space-y-2">
              <a href="mailto:info@seranorr.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Mail className="h-4 w-4" />
                info@seranorr.com
              </a>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-4">
              <a href="https://instagram.com/seranorr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/seranorr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground mb-6">
              {t('footer.collections')}
            </h4>
            <ul className="space-y-3">
              {['terra', 'vanta'].map((id) => (
                <li key={id}>
                  <Link to={`/collections/${id}`} className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">
                    {id.toUpperCase()}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/collections" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">
                  {t('footer.allCollections')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground mb-6">
              {t('footer.atelier')}
            </h4>
            <ul className="space-y-3">
              <li><Link to="/bespoke" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{t('nav.bespoke')}</Link></li>
              <li><Link to="/materials" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{t('footer.materialsCare')}</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Informatie */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground mb-6">
              {t('footer.service')}
            </h4>
            <ul className="space-y-3">
              <li><Link to="/voorstel" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{i18n.language === 'nl' ? 'Voorstel aanvragen' : 'Request proposal'}</Link></li>
              <li><Link to="/lookbook" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{i18n.language === 'nl' ? 'Online voorbeelden' : 'Online examples'}</Link></li>
              <li><Link to="/care" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{i18n.language === 'nl' ? 'Onderhoud & bescherming' : 'Care & protection'}</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{t('footer.shipping')}</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{t('footer.terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Sera Norr. {t('footer.copyright')}
            </p>
            <span className="hidden md:inline text-muted-foreground/40">|</span>
            <p className="text-muted-foreground/70 text-xs">
              {i18n.language === 'nl' 
                ? 'SERA NORR is een designatelier voor maatwerk natuursteenmeubels.'
                : 'SERA NORR is a design atelier for bespoke natural stone furniture.'}
            </p>
          </div>
          <p className="text-muted-foreground text-sm">{t('footer.crafted')}</p>
        </div>
      </div>
    </footer>
  );
}