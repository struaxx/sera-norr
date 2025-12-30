import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center bg-background">
        <div className="text-center px-6">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Page Not Found
          </p>
          <h1 className="font-serif text-display-lg text-foreground mb-6">404</h1>
          <p className="text-muted-foreground text-body-lg mb-12 max-w-md mx-auto">
            The page you're looking for has been moved or no longer exists.
          </p>
          <Button asChild variant="atelier" size="lg">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
