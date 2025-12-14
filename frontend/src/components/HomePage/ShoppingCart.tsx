import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CartItem {
  id: number;
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

export function ShoppingCart({ open, onOpenChange }: ShoppingCartProps) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1603122101829-e56305b0a5f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwc3VpdHxlbnwxfHx8fDE3NjEzOTQzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: "Classic Navy Suit",
      brand: "ARMANI",
      color: "Navy Blue",
      colorHex: "#1e3a8a",
      size: "L",
      price: 2850,
      quantity: 1,
      availableColors: [
        { name: "Navy Blue", hex: "#1e3a8a" },
        { name: "Black", hex: "#000000" },
        { name: "Charcoal", hex: "#4b5563" }
      ],
      availableSizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1758024699178-634329cb7cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZHJlc3MlMjBzaGlydHxlbnwxfHx8fDE3NjE0MTE2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: "Premium Cotton Shirt",
      brand: "RALPH LAUREN",
      color: "White",
      colorHex: "#ffffff",
      size: "M",
      price: 385,
      quantity: 2,
      availableColors: [
        { name: "White", hex: "#ffffff" },
        { name: "Light Blue", hex: "#e0f2fe" },
        { name: "Pink", hex: "#fce7f3" }
      ],
      availableSizes: ["S", "M", "L", "XL"]
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1658837407083-308b902ee99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbGVhdGhlciUyMHNob2VzfGVufDF8fHx8MTc2MTMwOTQxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: "Leather Oxford Shoes",
      brand: "SALVATORE FERRAGAMO",
      color: "Black",
      colorHex: "#000000",
      size: "10",
      price: 850,
      quantity: 1,
      availableColors: [
        { name: "Black", hex: "#000000" },
        { name: "Brown", hex: "#8B4513" }
      ],
      availableSizes: ["8", "9", "10", "11", "12"]
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const updateSize = (id: number, newSize: string) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, size: newSize }
          : item
      )
    );
  };

  const updateColor = (id: number, colorName: string, colorHex: string) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, color: colorName, colorHex: colorHex }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = cartItems.length === 0;

  const handleViewCart = () => {
    onOpenChange(false);
    navigate("/cart");
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
          {isEmpty ? (
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
                              onClick={() => removeItem(item.id)}
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
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-2 hover:bg-[#F5F5F5] transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-4 text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
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
