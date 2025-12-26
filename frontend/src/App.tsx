import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Collections } from "@/pages/Collections";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import OAuthCallbackPage from "@/pages/OAuthCallbackPage";
import ProductDetail from "@/pages/ProductDetail";
import CartPage from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";
import CheckoutPage from "@/pages/Checkout";
import OrderPaymentStatusPage from "@/pages/OrderPaymentStatus";
import OrdersPage from "@/pages/Orders";
import AccountPage from "@/pages/Account";
import PaymentErrorPage from "@/pages/PaymentError";
import SearchPage from "@/pages/SearchPage";
import { bootstrapAuthSession } from "@/lib/api";

// Scroll to top component that triggers on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return null;
}

export default function App() {
  useEffect(() => {
    void bootstrapAuthSession();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Collections listing (all) and filtered by collection */}
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:collection" element={<Collections />} />
        <Route path="/collections/:collection/:category" element={<Collections />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderPaymentStatusPage />} />
        <Route path="/orders/:orderId/status" element={<OrderPaymentStatusPage />} />
        <Route path="/payment-error" element={<PaymentErrorPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}
