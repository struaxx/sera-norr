import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Bespoke from "./pages/Bespoke";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Journal from "./pages/Journal";
import Materials from "./pages/Materials";
import MaterialDetail from "./pages/MaterialDetail";
import Voorstel from "./pages/Voorstel";
import Lookbook from "./pages/Lookbook";
import Care from "./pages/Care";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:collectionId" element={<CollectionDetail />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="/bespoke" element={<Bespoke />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/materials/:materialId" element={<MaterialDetail />} />
          <Route path="/voorstel" element={<Voorstel />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/care" element={<Care />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
