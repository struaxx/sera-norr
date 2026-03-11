import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CookieBanner } from "@/components/CookieBanner";

// Eagerly load homepage for fast initial render
import Index from "./pages/Index";

// Lazy load all other pages for better performance
const Collections = lazy(() => import("./pages/Collections"));
const Bespoke = lazy(() => import("./pages/Bespoke"));
const Atelier = lazy(() => import("./pages/Atelier"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Journal = lazy(() => import("./pages/Journal"));
const Voorstel = lazy(() => import("./pages/Voorstel"));

const Care = lazy(() => import("./pages/Care"));
const Insights = lazy(() => import("./pages/Insights"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/bespoke" element={<Bespoke />} />
            <Route path="/atelier" element={<Atelier />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/materials/:materialId" element={<MaterialDetail />} />
            <Route path="/proposal" element={<Voorstel />} />
            <Route path="/lookbook" element={<Collections />} />
            <Route path="/care" element={<Care />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
