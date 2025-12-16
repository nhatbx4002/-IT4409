import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ShoppingBag, Minus, Plus, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCart, updateCartItem, removeCartItem } from "@/lib/api";
import type { CartItem as ApiCartItem, CartResponse } from "@/types/cart";
import { isAuthenticated } from "@/lib/auth";
import { toast } from "sonner";

interface CartItem {
  id: number;
  cartItemId: number;
  image: string;
  name: string;
  brand: string;
  color: string;
  colorHex: string;
  size: string;
  price: number;
  quantity: number;
  availableColors: { name: string; hex: string }[];
  availableSizes: string[];
}

interface ShoppingCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mapApiCartItemToCartItem = (apiItem: ApiCartItem, index: number): CartItem => {
  const colorName = apiItem.color || "N/A";
  const colorHex = getColorHex(colorName);
  
  return {
    id: index + 1,
    cartItemId: apiItem.cart_item_id,
    image: apiItem.image_url || "https://via.placeholder.com/420",
    name: apiItem.product_name,
    brand: "ARISTINO",
    color: colorName,
    colorHex: colorHex,
    size: apiItem.size || "N/A",
    price: apiItem.unit_price,
    quantity: apiItem.quantity,
    availableColors: [{ name: colorName, hex: colorHex }],
    availableSizes: [apiItem.size || "N/A"],
  };
};

const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    "Navy Blue": "#1e3a8a",
    "Black": "#000000",
    "Charcoal": "#4b5563",
    "White": "#ffffff",
    "Brown": "#8B4513",
    "N/A": "#cccccc",
  };
  return colorMap[colorName] || "#cccccc";
};

export function ShoppingCart({ open, onOpenChange }: ShoppingCartProps) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState<CartResponse | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!open || !isAuthenticated()) {
        return;
      }

      try {
        setIsLoading(true);
        const cart = await getCart();
        setCartData(cart);
        setCartItems(cart.items.map((item, index) => mapApiCartItemToCartItem(item, index)));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load cart";
        toast.error(errorMessage);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [open]);

  const updateQuantity = async (cartItemId: number, change: number) => {
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    if (newQuantity === item.quantity) return;

    try {
      await updateCartItem(cartItemId, newQuantity);
      const cart = await getCart();
      setCartData(cart);
      setCartItems(cart.items.map((item, index) => mapApiCartItemToCartItem(item, index)));
      toast.success("Cart updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update quantity";
      toast.error(errorMessage);
    }
  };

  const updateSize = (id: number, newSize: string) => {
    toast.info("To change size, please remove this item and add the desired variant");
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, size: newSize }
          : item
      )
    );
  };

  const updateColor = (id: number, colorName: string, colorHex: string) => {
    toast.info("To change color, please remove this item and add the desired variant");
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, color: colorName, colorHex: colorHex }
          : item
      )
    );
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await removeCartItem(cartItemId);
      const cart = await getCart();
      setCartData(cart);
      setCartItems(cart.items.map((item, index) => mapApiCartItemToCartItem(item, index)));
      toast.success("Item removed from cart");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove item";
      toast.error(errorMessage);
    }
  };

  const subtotal = cartData?.subtotal_amount || cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = cartItems.length === 0;

  const handleViewCart = () => {
    onOpenChange(false);
    navigate("/cart");
  };

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-l border-black/10 bg-white/95 p-0 backdrop-blur-xl transition-all duration-500 ease-in-out sm:max-w-lg"
      >
        {/* Header */}
        <SheetHeader className="border-b border-black/10 bg-white/80 px-8 py-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle 
                className="mb-2"
                style={{ 
                  fontSize: '28px', 
                  fontFamily: "'Playfair Display', serif", 
                  fontWeight: 600 
                }}
              >
                Your Bag
              </SheetTitle>
              <div 
                className="w-16 h-0.5" 
                style={{ backgroundColor: '#D4AF37' }}
              ></div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="hover:text-[#D4AF37] transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <SheetDescription className="text-sm text-[#666666] mt-4">
            {isEmpty 
              ? 'Your shopping bag is currently empty' 
              : `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in your bag`
            }
          </SheetDescription>
        </SheetHeader>

        {/* Cart Content */}
        <div className="flex h-[calc(100vh-120px)] flex-col">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
            </div>
          ) : isEmpty ? (
            // Empty State
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <div
                className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#F5F5F5]"
              >
                <ShoppingBag className="h-12 w-12 text-[#666666]" />
              </div>
              <h3 
                className="mb-2"
                style={{ 
                  fontSize: '24px', 
                  fontFamily: "'Playfair Display', serif", 
                  fontWeight: 500 
                }}
              >
                Your bag is empty
              </h3>
              <p className="mb-8 text-[#666666]" style={{ fontSize: '16px' }}>
                Start adding items to your shopping bag
              </p>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="rounded-full border-2 border-[#D4AF37] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div 
                      key={item.id}
                      className="animate-in fade-in slide-in-from-right-5 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="h-32 w-24 shrink-0 overflow-hidden rounded-sm bg-[#F5F5F5]">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col">
                          <div className="mb-2 flex justify-between">
                            <div className="flex-1">
                              <p
                                className="mb-1 text-xs tracking-[0.18em] text-[#D4AF37]"
                              >
                                {item.brand}
                              </p>
                              <h4
                                className="mb-1 font-['Playfair_Display'] text-[15px] font-semibold text-[#111827]"
                              >
                                {item.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => removeItem(item.cartItemId)}
                              className="h-6 text-xs uppercase tracking-[0.18em] text-[#666666] transition-colors hover:text-[#D4AF37]"
                            >
                              Remove
                            </button>
                          </div>

                          {/* Color Selector */}
                          <div className="mb-3">
                            <label className="mb-2 block text-xs text-[#666666]">
                              Color
                            </label>
                            <div className="flex gap-2">
                              {item.availableColors.map((colorOption) => (
                                <button
                                  key={colorOption.hex}
                                  onClick={() => updateColor(item.id, colorOption.name, colorOption.hex)}
                                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                                    item.colorHex === colorOption.hex
                                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37] ring-offset-2'
                                      : 'border-gray-200 hover:border-[#D4AF37]'
                                  }`}
                                  style={{ backgroundColor: colorOption.hex }}
                                  title={colorOption.name}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Size Selector */}
                          <div className="mb-3">
                            <label className="mb-2 block text-xs text-[#666666]">
                              Size
                            </label>
                            <Select value={item.size} onValueChange={(value) => updateSize(item.id, value)}>
                              <SelectTrigger className="h-8 w-24 rounded-full border border-gray-300 bg-transparent px-3 text-xs text-[#111827]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {item.availableSizes.map((sizeOption) => (
                                  <SelectItem key={sizeOption} value={sizeOption}>
                                    {sizeOption}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="mt-auto flex items-center justify-between">
                            {/* Quantity Selector */}
                            <div className="flex items-center rounded-full border border-gray-300 bg-white">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="p-2 hover:bg-[#F5F5F5] transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-4 text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="p-2 hover:bg-[#F5F5F5] transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Line price */}
                            <p className="font-['Playfair_Display'] text-[18px] font-semibold text-[#111827]">
                              ${(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      {index < cartItems.length - 1 && (
                        <div className="mt-6 h-px bg-[#E5E7EB]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-black/10 bg-[#F5F5F5] px-8 py-6">
                {/* Subtotal */}
                <div className="mb-6 border-b border-[#D4AF37]/20 pb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.24em] text-[#6B7280]">
                      Subtotal
                    </span>
                    <span 
                      style={{ 
                        fontSize: '20px', 
                        fontWeight: 600,
                        fontFamily: "'Playfair Display', serif" 
                      }}
                    >
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#666666]">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full border-2 border-[#D4AF37] py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
                    onClick={handleViewCart}
                  >
                    View Cart
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="rounded-full bg-[#D4AF37] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#B6911F]"
                  >
                    Checkout
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-[#666666]">
                    Free shipping on orders over $200
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
