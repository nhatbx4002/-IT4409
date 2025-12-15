import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { getCart, createAddress, checkout } from "@/lib/api";
import type { CartResponse } from "@/types/cart";
import {
  CheckoutStepper,
  ContactInformation,
  ShippingAddressForm,
  PaymentMethodSelection,
  OrderSummary,
} from "@/components/Checkout";
import { isAuthenticated, getStoredUser } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<"information" | "payment">("information");

  // Form state
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [addressFormData, setAddressFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    is_default: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY" | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [shippingNote, setShippingNote] = useState<string>("Vui lòng nhập địa chỉ");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const user = getStoredUser();
    if (user?.email) {
      setContactEmail(user.email);
    }
    if (user?.phone) {
      setContactPhone(user.phone);
    }

    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const cart = await getCart();
        setCartData(cart);
        if (cart.applied_promotion_code) {
          setPromoCode(cart.applied_promotion_code);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load cart";
        toast.error(errorMessage);
        navigate("/cart");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const subtotal = useMemo(() => cartData?.subtotal_amount || 0, [cartData]);
  const total = useMemo(() => {
    const shipping = shippingFee ?? 0;
    return Math.max(subtotal + shipping - discountAmount, 0);
  }, [subtotal, shippingFee, discountAmount]);

  const canProceedToPayment = useMemo(() => {
    return (
      contactEmail.trim() !== "" &&
      // Accept phone from either contact info or shipping address
      (contactPhone.trim() !== "" || (addressFormData.phone?.trim?.() ?? "") !== "") &&
      addressFormData.full_name.trim() !== "" &&
      addressFormData.address.trim() !== "" &&
      addressFormData.city !== "" &&
      addressFormData.district !== "" &&
      addressFormData.ward !== ""
    );
  }, [contactEmail, contactPhone, addressFormData]);

  const handleAddressChange = (field: string, value: string | boolean) => {
    setAddressFormData((prev) => ({ ...prev, [field]: value }));
    
    // Update shipping fee when province/district changes
    if (field === "city" || field === "district") {
      if (addressFormData.city && addressFormData.district) {
        // Calculate shipping fee
        // This will be handled by the ShippingAddressForm component
      }
    }
  };

  const handleShippingFeeUpdate = (fee: number, note: string, discount: number) => {
    setShippingFee(fee);
    setShippingNote(note);
    setDiscountAmount(discount);
  };

  const handleProceedToPayment = () => {
    if (!canProceedToPayment) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setCurrentStep("payment");
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (!cartData || cartData.items.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    setIsSubmitting(true);
    try {
      // First, create the shipping address
      const address = await createAddress({
        full_name: addressFormData.full_name,
        phone: addressFormData.phone || contactPhone,
        address: addressFormData.address,
        city: addressFormData.city,
        district: addressFormData.district,
        ward: addressFormData.ward,
        is_default: addressFormData.is_default,
      });

      // Then, create the order
      const result = await checkout({
        shippingAddressId: address.id,
        paymentMethod,
        promotionCode: promoCode || undefined,
      });

      if (paymentMethod === "VNPAY" && result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      // Với COD, đặt hàng thành công ngay lập tức
      if (paymentMethod === "COD") {
        toast.success("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
        navigate(`/orders/${result.orderId}?cod=success`);
        return;
      }

      toast.success("Đặt hàng thành công!");
      navigate(`/orders/${result.orderId}/status`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to place order";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      </MainLayout>
    );
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Giỏ hàng trống</h1>
            <Link to="/cart" className="mt-4 inline-block text-blue-600 hover:underline">
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Header with Stepper */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <CheckoutStepper currentStep={currentStep} />
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
            {/* Left Column - Form */}
            <div className="space-y-8 lg:order-1">
              {currentStep === "information" ? (
                <>
                  <ContactInformation
                    email={contactEmail}
                    phone={contactPhone}
                    onEmailChange={setContactEmail}
                    onPhoneChange={setContactPhone}
                    isAuthenticated={isAuthenticated()}
                  />
                  <ShippingAddressForm
                    formData={addressFormData}
                    onFormChange={handleAddressChange}
                    onShippingFeeUpdate={handleShippingFeeUpdate}
                    promoCode={promoCode}
                    subtotal={subtotal}
                  />
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleProceedToPayment}
                      disabled={!canProceedToPayment}
                      className="rounded-md bg-black px-8 py-3 font-semibold text-white uppercase tracking-wide transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Tiếp tục đến thanh toán
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <PaymentMethodSelection
                    selectedMethod={paymentMethod}
                    onSelectMethod={setPaymentMethod}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep("information")}
                      className="rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!paymentMethod || isSubmitting}
                      className="flex-1 rounded-md bg-black px-8 py-3 font-semibold text-white uppercase tracking-wide transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : paymentMethod === "VNPAY" ? (
                        "Thanh toán qua VNPAY"
                      ) : (
                        "Hoàn tất đặt hàng"
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Bằng việc đặt hàng, bạn đồng ý với{" "}
                    <Link to="/terms" className="underline">
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link to="/privacy" className="underline">
                      Chính sách bảo mật
                    </Link>
                  </p>
                </>
              )}
            </div>

            {/* Right Column - Order Summary (Sticky on desktop, accordion on mobile) */}
            <div className="lg:sticky lg:top-8 lg:h-fit lg:order-2 order-first lg:order-2">
              <OrderSummary
                items={cartData.items}
                subtotal={subtotal}
                shippingFee={shippingFee}
                shippingNote={shippingNote}
                discountAmount={discountAmount}
                total={total}
                promoCode={promoCode}
                onPromoCodeChange={setPromoCode}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

