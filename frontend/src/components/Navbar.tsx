import { useEffect, useMemo, useState } from "react";
import {
  Search,
  User,
  UserPlus,
  LogIn,
  LogOut,
  UserCircle,
  Package,
  Heart,
  Settings,
  ShoppingBag,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "./HomePage/ShoppingCart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
        <div className="relative bg-black py-2 text-center text-white">
          <p className="text-xs tracking-[0.24em] uppercase text-slate-200 sm:text-sm">
            Premium menswear · Complimentary alterations · Free shipping over $200
          </p>
          <button
            onClick={() => setShowTopBar(false)}
            className="absolute right-6 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-sm">
        <div className="flex w-full items-center justify-between px-6 py-3 sm:px-8">
            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="shrink-0 text-left"
            >
              <h1
                className="text-2xl tracking-[0.32em] text-[#D4AF37] sm:text-3xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                ARISTINO
              </h1>
            </button>

            {/* Center Navigation */}
            <div className="hidden items-center gap-8 lg:flex">
              <button
                type="button"
                onClick={() => navigate("/collections?sort=newest")}
                className="text-xs font-medium tracking-[0.22em] text-[#4B5563] transition-colors hover:text-[#D4AF37]"
              >
                NEW ARRIVALS
              </button>
              <button
                type="button"
                onClick={() => navigate("/collections/men")}
                className="text-xs font-medium tracking-[0.22em] text-[#4B5563] transition-colors hover:text-[#D4AF37]"
              >
                SUITS
              </button>
              <button
                type="button"
                onClick={() => navigate("/collections/men/shirts")}
                className="text-xs font-medium tracking-[0.22em] text-[#4B5563] transition-colors hover:text-[#D4AF37]"
              >
                SHIRTS
              </button>
              <button
                type="button"
                onClick={() => navigate("/collections/men/outerwear")}
                className="text-xs font-medium tracking-[0.22em] text-[#4B5563] transition-colors hover:text-[#D4AF37]"
              >
                OUTERWEAR
              </button>
              <button
                type="button"
                onClick={() => navigate("/collections/men/accessories")}
                className="text-xs font-medium tracking-[0.22em] text-[#4B5563] transition-colors hover:text-[#D4AF37]"
              >
                ACCESSORIES
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate("/collections?sort=featured&title=Autumn%20Sale")
                }
                className="rounded-full border border-transparent bg-[#D4AF37] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#B6911F]"
              >
                Autumn Sale
              </button>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
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
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => navigate("/account")}> 
                      <UserCircle className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => navigate("/orders")}>
                      <Package className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">My Orders</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => navigate("/wishlist")}>
                      <Heart className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">Wishlist</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => navigate("/account")}>
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
                className="hidden sm:inline-flex hover:bg-transparent hover:text-[#D4AF37] transition-colors"
                onClick={() => navigate("/wishlist")}
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
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-[10px]"
                  style={{ backgroundColor: "#D4AF37", color: "#000" }}
                >
                  3
                </Badge>
              </Button>
              {/* Mobile nav trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex hover:bg-transparent hover:text-[#D4AF37] transition-colors lg:hidden"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
      </nav>

      {/* Mobile Nav Sheet */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="w-80 border-r border-black/10 bg-white p-0"
        >
          <SheetHeader className="border-b border-black/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <SheetTitle
                className="text-lg tracking-[0.28em] text-[#D4AF37]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                ARISTINO
              </SheetTitle>
              <SheetClose asChild>
                <button className="text-[#4B5563] hover:text-[#D4AF37]">
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>
          </SheetHeader>
          <div className="space-y-1 px-6 py-4 text-sm">
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
              onClick={() => {
                navigate("/collections?sort=newest");
                setMobileNavOpen(false);
              }}
            >
              New Arrivals
            </button>
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
              onClick={() => {
                navigate("/collections/men");
                setMobileNavOpen(false);
              }}
            >
              Suits
            </button>
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
              onClick={() => {
                navigate("/collections/men/shirts");
                setMobileNavOpen(false);
              }}
            >
              Shirts
            </button>
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
              onClick={() => {
                navigate("/collections/men/outerwear");
                setMobileNavOpen(false);
              }}
            >
              Outerwear
            </button>
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
              onClick={() => {
                navigate("/collections/men/accessories");
                setMobileNavOpen(false);
              }}
            >
              Accessories
            </button>

            <div className="mt-4 space-y-1 border-t border-black/10 pt-4">
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
                onClick={() => {
                  navigate("/wishlist");
                  setMobileNavOpen(false);
                }}
              >
                Wishlist
              </button>
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
                onClick={() => {
                  navigate("/cart");
                  setMobileNavOpen(false);
                }}
              >
                Cart
              </button>
              {!user ? (
                <button
                  className="mt-2 w-full rounded-full bg-[#111827] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white hover:bg-black"
                  onClick={() => {
                    handleDemoLogin();
                    setMobileNavOpen(false);
                  }}
                >
                  Sign in
                </button>
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Shopping Cart Sidebar */}
      <ShoppingCart open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
