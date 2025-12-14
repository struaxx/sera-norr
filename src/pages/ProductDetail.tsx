import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SEOHead, generateProductSchema, generateBreadcrumbSchema } from "@/components/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { USPBullets, ServicePromises, BespokeTimeline } from "@/components/trust";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";

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
  const { t, i18n } = useTranslation();
  const isNL = i18n.language === 'nl';
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
        // Track view_item event
        if (data) {
          trackViewItem({
            id: data.id,
            name: data.title,
            price: parseFloat(data.priceRange.minVariantPrice.amount),
            currency: data.priceRange.minVariantPrice.currencyCode,
          });
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

    // Track add_to_cart event
    trackAddToCart({
      id: product.id,
      name: product.title,
      price: parseFloat(variant.price.amount),
      currency: variant.price.currencyCode,
      quantity: 1,
      variant: variant.title,
    });

    toast.success(isNL ? "Toegevoegd aan winkeltas" : "Added to bag", {
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
        <SEOHead 
          title={isNL ? "Product niet gevonden" : "Product not found"}
          description={isNL ? "Dit product kon niet worden gevonden." : "This product could not be found."}
          noindex={true}
        />
        <section className="pt-32 lg:pt-40 pb-section bg-background">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h1 className="font-serif text-display-sm text-foreground mb-6">
              {isNL ? "Product niet gevonden" : "Product not found"}
            </h1>
            <Button asChild variant="atelier">
              <Link to="/collections">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {isNL ? "Terug naar collecties" : "Back to collections"}
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

  // SEO structured data
  const productSchema = generateProductSchema({
    title: product.title,
    description: product.description,
    price: price.amount,
    currency: price.currencyCode,
    image: currentImage?.url || '',
    handle: product.handle,
    available: product.variants.edges.some(v => v.node.availableForSale),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isNL ? 'Home' : 'Home', url: '/' },
    { name: isNL ? 'Collecties' : 'Collections', url: '/collections' },
    { name: product.title, url: `/product/${product.handle}` },
  ]);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [productSchema, breadcrumbSchema],
  };

  const seoDescription = product.description 
    ? product.description.slice(0, 155) 
    : `${product.title} - ${isNL ? 'Handgemaakt stenen meubelstuk van SERA NORR' : 'Handcrafted stone furniture piece by SERA NORR'}`;

  return (
    <Layout>
      <SEOHead 
        title={`${product.title} | SERA NORR`}
        description={seoDescription}
        type="product"
        image={currentImage?.url}
        structuredData={combinedSchema}
        keywords={`${product.title}, ${isNL ? 'stenen meubels, marmeren tafel, luxe meubels' : 'stone furniture, marble table, luxury furniture'}`}
      />

      <section className="pt-32 lg:pt-40 pb-section bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: isNL ? 'Collecties' : 'Collections', href: '/collections' },
              { label: product.title, href: `/product/${product.handle}` },
            ]}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[4/5] overflow-hidden">
                {currentImage && (
                  <OptimizedImage
                    src={currentImage.url}
                    alt={currentImage.altText || `${product.title} - ${isNL ? 'SERA NORR stenen meubel' : 'SERA NORR stone furniture'}`}
                    className="w-full h-full"
                    width={800}
                    height={1000}
                    priority
                    placeholder="blur"
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
                      aria-label={`${isNL ? 'Bekijk afbeelding' : 'View image'} ${index + 1}`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} - ${isNL ? 'afbeelding' : 'image'} ${index + 1}`}
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
              <p className="text-xl text-foreground mb-4">
                {price.currencyCode} {parseFloat(price.amount).toFixed(0)}
              </p>

              {/* USP Bullets - Above the fold */}
              <div className="mb-6 pb-6 border-b border-border/50">
                <USPBullets variant="horizontal" className="text-xs" />
              </div>

              {product.description && (
                <p className="text-muted-foreground text-body-md leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Variant Selector */}
              {hasMultipleVariants && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    {isNL ? 'Variant' : 'Variant'}
                  </p>
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
                className="w-full mb-4"
              >
                {isNL ? 'Toevoegen aan winkeltas' : 'Add to bag'}
              </Button>

              {/* Service Promises / Trust Elements */}
              <div className="border-t border-border pt-6">
                <ServicePromises variant="compact" />
              </div>

              {/* Bespoke CTA - Improved */}
              <div className="mt-8 p-6 bg-secondary/30 border border-border/50">
                <p className="font-serif text-lg text-foreground mb-2">
                  {isNL ? 'Andere afmetingen of materiaal?' : 'Different dimensions or material?'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {isNL 
                    ? 'Elk stuk kan op maat worden gemaakt. Ontvang binnen 48 uur een vrijblijvend voorstel.' 
                    : 'Every piece can be made to measure. Receive a no-obligation proposal within 48 hours.'}
                </p>
                <div className="mb-4">
                  <BespokeTimeline compact />
                </div>
                <Button asChild variant="atelier" size="sm" className="w-full">
                  <Link to="/bespoke">
                    {isNL ? 'Vraag maatwerk offerte aan' : 'Request bespoke quote'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
