import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { trackViewCart, trackBeginCheckout, trackRemoveFromCart } from "@/lib/analytics";

export const CartDrawer = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { 
    items, 
    isLoading, 
    updateQuantity, 
    removeItem, 
    createCheckout 
  } = useCartStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const currencyCode = items[0]?.price.currencyCode || 'EUR';

  // Track view_cart when drawer opens
  useEffect(() => {
    if (isOpen && items.length > 0) {
      trackViewCart(
        items.map(item => ({
          id: item.product.node.id,
          name: item.product.node.title,
          price: parseFloat(item.price.amount),
          currency: item.price.currencyCode,
          quantity: item.quantity,
        }))
      );
    }
  }, [isOpen, items]);

  const handleRemoveItem = (variantId: string) => {
    const item = items.find(i => i.variantId === variantId);
    if (item) {
      trackRemoveFromCart({
        id: item.product.node.id,
        name: item.product.node.title,
        price: parseFloat(item.price.amount),
        currency: item.price.currencyCode,
        quantity: item.quantity,
      });
    }
    removeItem(variantId);
  };

  const handleCheckout = async () => {
    // Track begin_checkout event
    trackBeginCheckout(
      items.map(item => ({
        id: item.product.node.id,
        name: item.product.node.title,
        price: parseFloat(item.price.amount),
        currency: item.price.currencyCode,
        quantity: item.quantity,
      }))
    );

    try {
      const checkoutUrl = await createCheckout();
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-foreground text-background">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-serif">Winkeltas</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Uw winkeltas is leeg" : `${totalItems} stuk${totalItems !== 1 ? 'ken' : ''} in uw tas`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Uw winkeltas is leeg</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="w-20 h-24 bg-ivory/50 overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm leading-tight mb-1">
                          {item.product.node.title}
                        </h4>
                        {item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.selectedOptions.map(option => option.value).join(' / ')}
                          </p>
                        )}
                        <p className="text-sm font-medium">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(0)}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-auto"
                            onClick={() => handleRemoveItem(item.variantId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-shrink-0 space-y-4 pt-6 border-t border-border mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotaal</span>
                  <span className="font-serif text-lg">
                    {currencyCode} {totalPrice.toFixed(0)}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full" 
                  variant="atelier-filled"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Laden...
                    </>
                  ) : (
                    <>
                      Afrekenen
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  U wordt doorgestuurd naar onze beveiligde checkout
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
