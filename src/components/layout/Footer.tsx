import { Link } from "react-router-dom";

const footerLinks = {
  collections: [
    { name: "TERRA", path: "/collections/terra" },
    { name: "VANTA", path: "/collections/vanta" },
    { name: "NORD", path: "/collections/nord" },
  ],
  atelier: [
    { name: "Bespoke", path: "/bespoke" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-serif text-2xl tracking-[0.15em] text-foreground">
              SERA NORR
            </Link>
            <p className="mt-6 max-w-md text-muted-foreground text-body-md leading-relaxed">
              Objects shaped by material, proportion, and silence. 
              A bespoke furniture atelier crafting sculptural stone pieces 
              for modern interiors.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground mb-6">
              Collections
            </h4>
            <ul className="space-y-3">
              {footerLinks.collections.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atelier */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground mb-6">
              Atelier
            </h4>
            <ul className="space-y-3">
              {footerLinks.atelier.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Sera Norr. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Crafted in Europe
          </p>
        </div>
      </div>
    </footer>
  );
}
