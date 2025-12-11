import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      <div className="aspect-[4/5] bg-ivory/50 overflow-hidden mb-4">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Geen afbeelding
          </div>
        )}
      </div>
      <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-foreground/80 transition-colors">
        {node.title}
      </h3>
      <p className="text-muted-foreground text-sm">
        {price.currencyCode} {parseFloat(price.amount).toFixed(0)}
      </p>
    </Link>
  );
};
