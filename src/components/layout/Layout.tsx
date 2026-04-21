import { Header } from "./Header";
import { Footer } from "./Footer";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <OrganizationJsonLd />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
