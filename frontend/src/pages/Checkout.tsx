import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { getCart, createAddress, checkout, getMyAddresses } from "@/lib/api";
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
import { Loader2, Plus, CheckCircle2 } from "lucide-react";
import type { ShippingAddress } from "@/types/checkout";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<"information" | "payment">("information");
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

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
  const [shippingNote, setShippingNote] = useState<string>("Tính ở bước sau");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

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
        const addrList = await getMyAddresses();
        setAddresses(addrList);
        const defaultAddr = addrList.find((a) => a.is_default) || addrList[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setAddressFormData({
            full_name: defaultAddr.full_name || "",
            phone: defaultAddr.phone || "",
            address: defaultAddr.address || "",
            city: defaultAddr.city || "",
            district: defaultAddr.district || "",
            ward: defaultAddr.ward || "",
            is_default: defaultAddr.is_default || false,
          });
          setIsAddingAddress(false);
        } else {
          setIsAddingAddress(false);
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
      (
        selectedAddressId !== null ||
        (addressFormData.full_name.trim() !== "" &&
          addressFormData.address.trim() !== "" &&
          addressFormData.city !== "" &&
          addressFormData.district !== "" &&
          addressFormData.ward !== "")
      )
    );
  }, [contactEmail, contactPhone, addressFormData, selectedAddressId]);

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

  const handleSaveAddress = async () => {
    if (
      !addressFormData.full_name.trim() ||
      !addressFormData.address.trim() ||
      !addressFormData.city ||
      !addressFormData.district ||
      !addressFormData.ward ||
      !(addressFormData.phone || contactPhone)
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    try {
      setIsSavingAddress(true);
      const newAddress = await createAddress({
        full_name: addressFormData.full_name,
        phone: addressFormData.phone || contactPhone,
        address: addressFormData.address,
        city: addressFormData.city,
        district: addressFormData.district,
        ward: addressFormData.ward,
        is_default: addressFormData.is_default,
      });

      setAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddressId(newAddress.id);
      setIsAddingAddress(false);
      toast.success("Đã lưu địa chỉ mới");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không lưu được địa chỉ";
      toast.error(errorMessage);
    } finally {
      setIsSavingAddress(false);
    }
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
      let shippingAddressId: number | null = selectedAddressId;

      if (!shippingAddressId) {
        const address = await createAddress({
          full_name: addressFormData.full_name,
          phone: addressFormData.phone || contactPhone,
          address: addressFormData.address,
          city: addressFormData.city,
          district: addressFormData.district,
          ward: addressFormData.ward,
          is_default: addressFormData.is_default,
        });
        shippingAddressId = address.id;
      }

      // Then, create the order
      const result = await checkout({
        shippingAddressId: shippingAddressId!,
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
          <div className="w-full px-4 py-6 sm:px-8 lg:px-12 xl:px-16">
            <CheckoutStepper currentStep={currentStep} />
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="w-full px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_0.65fr]">
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
                  <AddressSelector
                    addresses={addresses}
                    selectedId={selectedAddressId}
                    onSelect={(id) => {
                      setSelectedAddressId(id);
                      setIsAddingAddress(false);
                    }}
                    onAddNew={() => {
                      setSelectedAddressId(null);
                      setIsAddingAddress(true);
                    }}
                  />
                  {isAddingAddress && (
                    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm">
                      <h3 className="mb-4 text-lg font-semibold text-black">Thêm địa chỉ mới</h3>
                      <ShippingAddressForm
                        formData={addressFormData}
                        onFormChange={handleAddressChange}
                        onShippingFeeUpdate={handleShippingFeeUpdate}
                        promoCode={promoCode}
                        subtotal={subtotal}
                      />
                      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 text-sm text-gray-600">
                        {addresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setIsAddingAddress(false)}
                            className="text-sm font-semibold text-gray-500 hover:text-black underline underline-offset-2"
                          >
                            Hủy
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleSaveAddress}
                          disabled={isSavingAddress}
                          className="rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-800 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSavingAddress ? "Đang lưu..." : "Lưu địa chỉ"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingAddress(false);
                            setSelectedAddressId(null);
                            toast.success("Sẽ dùng địa chỉ này cho đơn này");
                          }}
                          className="rounded-full bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-gray-900"
                        >
                          Dùng địa chỉ này
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    <Link to="/cart" className="text-sm font-semibold text-gray-600 hover:text-black underline underline-offset-4">
                      Quay lại giỏ hàng
                    </Link>
                    <button
                      onClick={handleProceedToPayment}
                      disabled={!canProceedToPayment}
                      className="rounded-full bg-black px-8 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Tiếp tục đến vận chuyển
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
                onDiscountAmountChange={setDiscountAmount}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
}: {
  addresses: ShippingAddress[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddNew: () => void;
}) {
  if (addresses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-black">Bạn chưa có địa chỉ lưu</p>
            <p className="text-xs text-gray-600">Thêm địa chỉ mới để giao hàng nhanh hơn.</p>
          </div>
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:border-black"
          >
            <Plus className="h-4 w-4" />
            Thêm địa chỉ mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-black">Chọn địa chỉ</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => {
          const isSelected = selectedId === address.id;
          return (
            <button
              key={address.id}
              type="button"
              onClick={() => onSelect(address.id)}
              className={`relative flex h-full flex-col rounded-2xl border p-4 text-left transition hover:border-[#C2A26F] hover:shadow-md ${
                isSelected ? "border-[#C2A26F] bg-[#FFF9EC]" : "border-gray-200 bg-white"
              }`}
            >
              {isSelected && (
                <span className="absolute right-3 top-3 text-[#C2A26F]">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
              )}
              <p className="text-sm font-semibold text-black">{address.full_name}</p>
              <p className="text-sm text-gray-600">{address.phone}</p>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                {address.address}, {address.ward}, {address.district}, {address.city}
              </p>
              {address.is_default && (
                <span className="mt-3 inline-flex w-fit items-center rounded-full bg-black px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  Default
                </span>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={onAddNew}
          className="flex h-full min-h-[150px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white text-sm font-semibold text-gray-600 transition hover:border-[#C2A26F] hover:text-black"
        >
          <Plus className="mb-2 h-5 w-5" />
          Thêm địa chỉ mới
        </button>
      </div>
    </div>
  );
}
