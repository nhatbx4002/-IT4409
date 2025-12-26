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
import { LuxurySearchOverlay } from "./LuxurySearchOverlay";
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
import { useNavigate, useLocation } from "react-router-dom";

import { getStoredUser, isAuthenticated, logout } from "@/lib/auth";
import type { AuthUser } from "@/types/auth";
import { getCart, getWishlist } from "@/lib/api";


export function Navbar() {
  const [showTopBar, setShowTopBar] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const currentUser = isAuthenticated() ? getStoredUser() : null;
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!isAuthenticated()) {
        setCartCount(0);
        setWishlistCount(0);
        return;
      }

      try {
        const cart = await getCart();
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } catch {
        setCartCount(0);
      }

      try {
        const currentUser = getStoredUser();
        if (currentUser?.id) {
          const wishlist = await getWishlist(currentUser.id);
          setWishlistCount(wishlist.count || wishlist.data?.length || 0);
        }
      } catch {
        setWishlistCount(0);
      }
    };

    fetchCounts();
    
    const interval = setInterval(fetchCounts, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const initials = useMemo(() => {
    if(!user) return "U";
    return (user.name || '').split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase();
  },[user])

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            Thời trang nam cao cấp · Sửa đồ miễn phí · Miễn phí vận chuyển cho đơn trên $200
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
                HÀNG MỚI
              </button>
              <button
                type="button"
                onClick={() => navigate("/collections/ao")}
                className="text-xs font-medium tracking-[0.22em] text-[#4B5563] transition-colors hover:text-[#D4AF37]"
              >
                ÁO
              </button>
              <button
                type="button"
                onClick={() => navigate("/collections/quan")}
                className="text-xs font-medium tracking-[0.22em] text-[#4B5563] transition-colors hover:text-[#D4AF37]"
              >
                QUẦN
              </button>
              <button
                type="button"
                onClick={() => navigate("/collections/phu-kien")}
                className="text-xs font-medium tracking-[0.22em] text-[#4B5563] transition-colors hover:text-[#D4AF37]"
              >
                PHỤ KIỆN
              </button>
              <button
                type="button"
                onClick={() => navigate("/collections/nuoc-hoa")}
                className="text-xs font-medium tracking-[0.22em] text-[#4B5563] transition-colors hover:text-[#D4AF37]"
              >
                NƯỚC HOA
              </button>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent hover:text-[#D4AF37] transition-colors relative group"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
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
                        <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover"/>
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
                        <span className="text-sm">Đăng nhập</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-[#F5F5F5] py-3"
                        onClick={() => navigate("/signup")}
                      >
                        <UserPlus className="h-4 w-4 mr-3 text-[#D4AF37]" />
                        <span className="text-sm">Đăng ký</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                ) : (
                   <DropdownMenuContent align="end" className="w-72 bg-white border border-black/10 shadow-lg">
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => navigate("/account")}> 
                      <UserCircle className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">Hồ sơ của tôi</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => navigate("/orders")}>
                      <Package className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">Đơn hàng của tôi</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => navigate("/wishlist")}>
                      <Heart className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">Yêu thích</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#F5F5F5] py-3" onClick={() => navigate("/account")}>
                      <Settings className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">Cài đặt</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-[#D4AF37]/20" />
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#FFF4DB] py-3" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-3 text-[#D4AF37]" />
                      <span className="text-sm">Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:inline-flex hover:bg-transparent hover:text-[#D4AF37] transition-colors"
                onClick={() => navigate("/wishlist")}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-[10px]"
                    style={{ backgroundColor: "#D4AF37", color: "#000" }}
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-transparent hover:text-[#D4AF37] transition-colors"
                onClick={() => {
                  // Don't open cart sidebar if already on cart page
                  if (location.pathname === "/cart") {
                    return;
                  }
                  setCartOpen(true);
                }}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-[10px]"
                    style={{ backgroundColor: "#D4AF37", color: "#000" }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
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
              Hàng Mới
            </button>
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
              onClick={() => {
                navigate("/collections/ao");
                setMobileNavOpen(false);
              }}
            >
              Áo
            </button>
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
              onClick={() => {
                navigate("/collections/quan");
                setMobileNavOpen(false);
              }}
            >
              Quần
            </button>
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
              onClick={() => {
                navigate("/collections/phu-kien");
                setMobileNavOpen(false);
              }}
            >
              Phụ Kiện
            </button>
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
              onClick={() => {
                navigate("/collections/nuoc-hoa");
                setMobileNavOpen(false);
              }}
            >
              Nước Hoa
            </button>

            <div className="mt-4 space-y-1 border-t border-black/10 pt-4">
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
                onClick={() => {
                  navigate("/wishlist");
                  setMobileNavOpen(false);
                }}
              >
                Yêu thích
              </button>
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-[#111827] hover:bg-[#F3F4F6]"
                onClick={() => {
                  navigate("/cart");
                  setMobileNavOpen(false);
                }}
              >
                Giỏ hàng
              </button>
              {!user ? (
                <button
                  className="mt-2 w-full rounded-full bg-[#111827] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white hover:bg-black"
                  onClick={() => {
                    handleDemoLogin();
                    setMobileNavOpen(false);
                  }}
                >
                  Đăng nhập
                </button>
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Shopping Cart Sidebar */}
      <ShoppingCart open={cartOpen} onOpenChange={setCartOpen} />

      {/* Luxury Search Overlay */}
      <LuxurySearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
