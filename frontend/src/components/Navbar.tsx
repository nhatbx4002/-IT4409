import { useEffect, useMemo, useState } from "react";
import {
  Search, User, UserPlus, LogIn, LogOut,
  UserCircle, Package, Heart, Settings, ShoppingBag , X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "./HomePage/ShoppingCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

import { getStoredUser, isAuthenticated, logout } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";


export function Navbar() {
  const [showTopBar, setShowTopBar] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const [user,setUser] = useState<AuthUser | null>(null);

  useEffect(() =>{
    setUser(isAuthenticated() ? getStoredUser() : null);
  },[]);

  const initials = useMemo(() => {
    if(!user) return "U";
    return (user.full_name || '').split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase();
  },[user])

  const handleLogout = () => {
    logout();
    setUser(null);
  }

  const handleDemoLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Top Bar */}
      {showTopBar && (
        <div className="bg-black text-white py-2 px-6 text-center relative">
          <p className="text-sm">Premium Men's Fashion | Free Shipping on Orders Over $200</p>
          <button
            onClick={() => setShowTopBar(false)}
            className="absolute right-6 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white/98 backdrop-blur-sm border-b border-black/10 shadow-sm">
        <div className="max-w-full mx-auto px-30 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <h1 
                className="text-3xl tracking-wider" 
                style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}
              >
                ARISTINO
              </h1>
            </div>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-sm tracking-wide hover:text-[#D4AF37] transition-colors">
                NEW ARRIVALS
              </a>
              <a href="#" className="text-sm tracking-wide hover:text-[#D4AF37] transition-colors">
                SUITS
              </a>
              <a href="#" className="text-sm tracking-wide hover:text-[#D4AF37] transition-colors">
                SHIRTS
              </a>
              <a href="#" className="text-sm tracking-wide hover:text-[#D4AF37] transition-colors">
                OUTERWEAR
              </a>
              <a href="#" className="text-sm tracking-wide hover:text-[#D4AF37] transition-colors">
                ACCESSORIES
              </a>
              <a 
                href="#" 
                className="relative text-sm tracking-wide px-4 py-2 overflow-hidden group sale-button"
                style={{
                  fontWeight: 600
                }}
              >
                {/* Animated gradient background */}
                <div 
                  className="absolute inset-0 sale-gradient"
                  style={{
                    background: 'linear-gradient(90deg, #D4AF37 0%, #FFD700 25%, #D4AF37 50%, #B8960F 75%, #D4AF37 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s linear infinite'
                  }}
                ></div>
                
                {/* Pulsing glow effect */}
                <div 
                  className="absolute inset-0"
                  style={{
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
                    animation: 'pulse-glow 2s ease-in-out infinite'
                  }}
                ></div>

                {/* Main text */}
                <span 
                  className="relative z-10 inline-block"
                  style={{ 
                    color: '#000000',
                    animation: 'text-pop 1s ease-in-out infinite'
                  }}
                >
                  SALE
                </span>

                {/* Hover overlay */}
                <div 
                  className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left z-10"
                  style={{ transitionDuration: '300ms' }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  SALE
                </span>
              </a>

              <style>{`
                @keyframes shimmer {
                  0% {
                    background-position: 0% 0%;
                  }
                  100% {
                    background-position: 200% 0%;
                  }
                }

                @keyframes pulse-glow {
                  0%, 100% {
                    opacity: 0.6;
                  }
                  50% {
                    opacity: 1;
                  }
                }

                @keyframes text-pop {
                  0%, 100% {
                    transform: scale(1);
                  }
                  50% {
                    transform: scale(1.05);
                  }
                }
              `}</style>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-transparent hover:text-[#D4AF37] transition-colors"
              >
                <Search className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-transparent hover:text-[#D4AF37] transition-colors"
                  >
                    {user ? (
                      user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.full_name} className="h-8 w-8 rounded-full object-cover"/>
                      ): (
                        <div className="h-8 w-8 rounded-full bg-black/80 text-white text-xs flex items-center justify-center">
                          {initials}
                        </div>
                      )
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                { !user ? (
                  <DropdownMenuContent align="end" className="w-64 bg-white border border-black/10 shadow-lg">
                    <DropdownMenuSeparator className="bg-[#D4AF37]/20" />
                      <DropdownMenuItem
                          className="cursor-pointer hover:bg-[#F5F5F5] py-3"
                         // FE-only: chuyển trang login hoặc dùng demo login
                          onClick={() => handleDemoLogin()}
                        >
                        <LogIn className="h-4 w-4 mr-3 text-[#D4AF37]" />
                        <span className="text-sm">Login (Demo)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-[#F5F5F5] py-3"
                        onClick={() => navigate("/signup")}
                      >
                        <UserPlus className="h-4 w-4 mr-3 text-[#D4AF37]" />
                        <span className="text-sm">Register</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                ) : (
                   <DropdownMenuContent align="end" className="w-72 bg-white border border-black/10 shadow-lg">
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => alert("Go /account")}>
                      <UserCircle className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => alert("Go /orders")}>
                      <Package className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">My Orders</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => alert("Go /wishlist")}>
                      <Heart className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">Wishlist</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => alert("Go /account/settings")}>
                      <Settings className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">Settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-[#D4AF37]/20" />
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#FFF4DB] py-3" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-transparent hover:text-[#D4AF37] transition-colors"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-transparent hover:text-[#D4AF37] transition-colors"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  style={{ backgroundColor: '#D4AF37', color: '#000' }}
                >
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Shopping Cart Sidebar */}
      <ShoppingCart open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
