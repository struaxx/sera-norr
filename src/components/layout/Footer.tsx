import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="font-serif text-2xl tracking-[0.15em] text-foreground">
              SERA NORR
            </Link>
            <p className="mt-6 max-w-md text-muted-foreground text-body-md leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground mb-6">
              {t('footer.collections')}
            </h4>
            <ul className="space-y-3">
              {['terra', 'vanta', 'nord'].map((id) => (
                <li key={id}>
                  <Link to={`/collections/${id}`} className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">
                    {id.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground mb-6">
              {t('footer.atelier')}
            </h4>
            <ul className="space-y-3">
              <li><Link to="/bespoke" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{t('nav.bespoke')}</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline">{t('nav.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Sera Norr. {t('footer.copyright')}
          </p>
          <p className="text-muted-foreground text-sm">Crafted in Europe</p>
        </div>
      </div>
    </footer>
  );
}
