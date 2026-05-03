import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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


const Care = lazy(() => import("./pages/Care"));
const Founders = lazy(() => import("./pages/Founders"));
const Aanvraag = lazy(() => import("./pages/Aanvraag"));
const SampleKit = lazy(() => import("./pages/SampleKit"));

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
            <Route path="/configurator" element={<Bespoke />} />
            <Route path="/over" element={<About />} />
            <Route path="/about" element={<Navigate to="/over" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/journal" element={<Journal />} />
            
            <Route path="/lookbook" element={<Collections />} />
            <Route path="/care" element={<Care />} />
            <Route path="/founders" element={<Founders />} />
            <Route path="/aanvraag" element={<Aanvraag />} />
            <Route path="/sample-kit" element={<SampleKit />} />
            
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
