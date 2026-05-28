import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center bg-background">
        <div className="text-center px-6 max-w-xl">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-foreground/60 mb-4">
            {isNL ? "Pagina niet gevonden" : "Page Not Found"}
          </p>
          <h1 className="font-serif text-display-lg text-foreground mb-6">404</h1>
          <p className="text-foreground/70 text-body-lg mb-8 max-w-md mx-auto">
            {isNL 
              ? "De pagina die u zoekt is verplaatst of bestaat niet meer."
              : "The page you're looking for has been moved or no longer exists."}
          </p>
          
          {/* Helpful navigation options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild variant="atelier" size="lg">
              <Link to="/">
                {isNL ? "Naar home" : "Return Home"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/collections">
                {isNL ? "Bekijk lookbook" : "Browse Lookbook"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Quick links */}
          <div className="pt-8 border-t border-foreground/10">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4">
              {isNL ? "Populaire pagina's" : "Popular pages"}
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link 
                to="/atelier" 
                className="text-foreground/70 hover:text-foreground transition-colors underline underline-offset-4"
              >
                {isNL ? "Atelier" : "Atelier"}
              </Link>
              <Link 
                to="/collections" 
                className="text-foreground/70 hover:text-foreground transition-colors underline underline-offset-4"
              >
                {isNL ? "Lookbook" : "Lookbook"}
              </Link>
              <Link 
                to="/over" 
                className="text-foreground/70 hover:text-foreground transition-colors underline underline-offset-4"
              >
                {isNL ? "Over ons" : "About"}
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground/70 hover:text-foreground transition-colors underline underline-offset-4"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
