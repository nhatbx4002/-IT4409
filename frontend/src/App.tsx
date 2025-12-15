import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Collections } from "@/pages/Collections";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import OAuthCallbackPage from "@/pages/OAuthCallbackPage";
import ProductDetail from "@/pages/ProductDetail";
import CartPage from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";
import CheckoutPage from "@/pages/Checkout";
import OrderPaymentStatusPage from "@/pages/OrderPaymentStatus";
import OrdersPage from "@/pages/Orders";
import AccountPage from "@/pages/Account";
import PaymentErrorPage from "@/pages/PaymentError";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Collections listing (all) and filtered by collection */}
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:collection" element={<Collections />} />
        <Route path="/collections/:collection/:category" element={<Collections />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
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
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}
