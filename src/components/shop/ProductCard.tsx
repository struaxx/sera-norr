import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { trackViewItem } from "@/lib/analytics";
import { useEffect } from "react";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  // Track when product card enters viewport (consider as product impression)
  useEffect(() => {
    trackViewItem({
      id: node.id,
      name: node.title,
      price: parseFloat(price.amount),
      currency: price.currencyCode,
    });
  }, [node.id, node.title, price.amount, price.currencyCode]);

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden mb-4">
        {image ? (
          <OptimizedImage
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full transition-transform duration-700 group-hover:scale-105"
            width={600}
            height={750}
            placeholder="blur"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/20">
            Geen afbeelding
          </div>
        )}
      </div>
      <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-foreground/80 transition-colors">
        {node.title}
      </h3>
      <p className="text-muted-foreground text-sm">
        Prijs op aanvraag
      </p>
    </Link>
  );
};
