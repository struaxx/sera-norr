import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

interface ProductData {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { t } = useTranslation();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setLoading(true);
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        if (data?.variants.edges.length > 0) {
          setSelectedVariant(data.variants.edges[0].node.id);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const variant = product.variants.edges.find(
      (v) => v.node.id === selectedVariant
    )?.node;

    if (!variant) return;

    const cartItem: CartItem = {
      product: {
        node: product,
      },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Toegevoegd aan winkeltas", {
      description: product.title,
      position: "top-center",
    });
  };

  if (loading) {
    return (
      <Layout>
        <section className="pt-32 lg:pt-40 pb-section bg-background">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <Skeleton className="aspect-[4/5] w-full" />
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="pt-32 lg:pt-40 pb-section bg-background">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h1 className="font-serif text-display-sm text-foreground mb-6">
              Product niet gevonden
            </h1>
            <Button asChild variant="atelier">
              <Link to="/collections">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar collecties
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const images = product.images.edges;
  const currentImage = images[selectedImage]?.node;
  const price = product.priceRange.minVariantPrice;
  const hasMultipleVariants = product.variants.edges.length > 1;

  return (
    <Layout>
      <section className="pt-32 lg:pt-40 pb-section bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Back Link */}
          <Link
            to="/collections"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar collecties
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-ivory/50 overflow-hidden">
                {currentImage && (
                  <img
                    src={currentImage.url}
                    alt={currentImage.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-24 bg-ivory/50 overflow-hidden transition-opacity ${
                        selectedImage === index ? "opacity-100 ring-1 ring-foreground" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:pt-8">
              <h1 className="font-serif text-display-sm text-foreground mb-4">
                {product.title}
              </h1>
              <p className="text-xl text-foreground mb-6">
                {price.currencyCode} {parseFloat(price.amount).toFixed(0)}
              </p>

              {product.description && (
                <p className="text-muted-foreground text-body-md leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Variant Selector */}
              {hasMultipleVariants && (
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-3">Variant</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((variant) => (
                      <button
                        key={variant.node.id}
                        onClick={() => setSelectedVariant(variant.node.id)}
                        disabled={!variant.node.availableForSale}
                        className={`px-4 py-2 text-sm border transition-colors ${
                          selectedVariant === variant.node.id
                            ? "border-foreground bg-foreground text-background"
                            : variant.node.availableForSale
                            ? "border-border hover:border-foreground"
                            : "border-border opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {variant.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                variant="atelier-filled"
                size="lg"
                className="w-full mb-6"
              >
                Toevoegen aan winkeltas
              </Button>

              {/* Features */}
              <div className="border-t border-border pt-8 space-y-3">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Handgemaakt in Europa</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Maatwerk mogelijk op aanvraag</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Professionele levering en plaatsing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
