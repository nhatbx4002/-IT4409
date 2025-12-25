import { useState, useEffect } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { getActiveDiscounts, validateDiscountCode, applyDiscountWithCart, getCartItemsForDiscount } from "@/lib/api";
import type { DiscountDTO } from "@/lib/api";
import { toast } from "sonner";

// ============================================
// TYPES
// ============================================

export type VoucherStatus = "idle" | "loading" | "success" | "error";

interface VoucherSelectorProps {
  promoCode: string;
  appliedPromo: boolean;
  onPromoCodeChange: (code: string) => void;
  onApplyPromo: () => void;
  onDiscountChange: (amount: number) => void;
  subtotal: number;
  shippingFee: number;
  className?: string;
}

interface VoucherCardProps {
  voucher: DiscountDTO;
  isSelected: boolean;
  onSelect: (voucher: DiscountDTO) => void;
  subtotal: number;
}

// ============================================
// STYLES (Gold Luxury Theme)
// ============================================

const STYLES = {
  // Gold accent color
  gold: "#D4AF37",
  goldLight: "#fffcf5",
  goldBorder: "#D4AF37",

  // Text colors
  textPrimary: "#000000",
  textSecondary: "#333333",
  textMuted: "#999999",

  // Borders
  borderNormal: "#E5E5E5",
  borderHover: "#D4AF37",
  borderSelected: "#D4AF37",

  // Backgrounds
  bgNormal: "#FFFFFF",
  bgSelected: "#fffcf5",
  bgHover: "#FAFAFA",

  // Status colors
  error: "#DC2626",
  errorBg: "#FEE2E2",
  success: "#10B981",
  successBg: "#F0FDF4",
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatDiscountText = (voucher: DiscountDTO): string => {
  if (voucher.discount_type === "percentage") {
    return `Giảm ${voucher.discount_value}%`;
  } else if (voucher.discount_type === "fixed_amount") {
    return `Giảm ${new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(voucher.discount_value)}`;
  } else if (voucher.discount_type === "free_shipping") {
    return "Freeship";
  }
  return "";
};

const isVoucherApplicable = (voucher: DiscountDTO, subtotal: number): boolean => {
  if (voucher.min_order_value && subtotal < voucher.min_order_value) {
    return false;
  }
  return true;
};

const getVoucherWarning = (voucher: DiscountDTO, subtotal: number): string | null => {
  if (voucher.min_order_value && subtotal < voucher.min_order_value) {
    const minOrderText = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(voucher.min_order_value);
    return `Đơn tối thiểu ${minOrderText}`;
  }
  return null;
};

// ============================================
// SUBCOMPONENTS
// ============================================

const VoucherCard = ({ voucher, isSelected, onSelect, subtotal }: VoucherCardProps) => {
  const warning = getVoucherWarning(voucher, subtotal);
  const isApplicable = isVoucherApplicable(voucher, subtotal);

  return (
    <button
      type="button"
      onClick={() => isApplicable && onSelect(voucher)}
      disabled={!isApplicable}
      className={`
        relative w-full rounded-lg border-2 p-4 text-left transition-all duration-300
        ${
          isSelected
            ? `border-[${STYLES.goldBorder}] bg-[${STYLES.goldLight}] shadow-sm`
            : isApplicable
            ? `border-[${STYLES.borderNormal}] bg-[${STYLES.bgNormal}] hover:border-[${STYLES.borderHover}] hover:bg-[${STYLES.bgHover}]`
            : `border-[${STYLES.borderNormal}] bg-[${STYLES.bgNormal}] opacity-50 cursor-not-allowed`
        }
      `}
      style={
        isSelected
          ? { borderColor: STYLES.goldBorder, backgroundColor: STYLES.goldLight }
          : undefined
      }
    >
      {/* Radio Circle Indicator */}
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0 mt-0.5">
          <div
            className={`
              h-5 w-5 rounded-full border-2 transition-all duration-200
              ${
                isSelected
                  ? `border-[${STYLES.goldBorder}] bg-[${STYLES.goldBorder}]`
                  : `border-[${STYLES.borderNormal}] bg-white`
              }
            `}
            style={
              isSelected
                ? { borderColor: STYLES.goldBorder, backgroundColor: STYLES.goldBorder }
                : {}
            }
          >
            {isSelected && (
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Badge */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h4
              className={`text-sm font-bold leading-tight ${STYLES.textPrimary}`}
              style={{ color: STYLES.textPrimary }}
            >
              {voucher.name}
            </h4>
            {voucher.code && (
              <span
                className={`
                  flex-shrink-0 rounded-full px-2.5 py-1
                  text-[10px] font-bold uppercase tracking-wider
                  ${isSelected ? "bg-[#D4AF37] text-white" : "bg-black text-white"}
                `}
              >
                {voucher.code}
              </span>
            )}
          </div>

          {/* Discount Value */}
          <p
            className={`text-xs font-semibold mb-1`}
            style={{ color: STYLES.gold }}
          >
            {formatDiscountText(voucher)}
          </p>

          {/* Description */}
          {voucher.description && (
            <p
              className={`text-xs leading-relaxed`}
              style={{ color: STYLES.textMuted }}
            >
              {voucher.description}
            </p>
          )}

          {/* Warning Message */}
          {warning && (
            <p
              className={`text-[10px] font-medium mt-2`}
              style={{ color: STYLES.error }}
            >
              {warning}
            </p>
          )}

          {/* Min Order Hint */}
          {voucher.min_order_value && isApplicable && (
            <p
              className={`text-[10px] mt-1`}
              style={{ color: STYLES.textMuted }}
            >
              Đơn tối thiểu:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(voucher.min_order_value)}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const LuxuryVoucherSelector = ({
  promoCode,
  appliedPromo,
  onPromoCodeChange,
  onApplyPromo,
  onDiscountChange,
  subtotal,
  shippingFee,
  className = "",
}: VoucherSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [vouchers, setVouchers] = useState<DiscountDTO[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Fetch available vouchers when expanded
  useEffect(() => {
    if (isExpanded && vouchers.length === 0) {
      const fetchVouchers = async () => {
        try {
          setIsLoadingVouchers(true);
          const data = await getActiveDiscounts();
          // Filter only code-based vouchers (not auto-apply)
          const codeVouchers = data.filter((v) => v.apply_type === "code");
          setVouchers(codeVouchers);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Không thể tải mã ưu đãi";
          toast.error(message);
        } finally {
          setIsLoadingVouchers(false);
        }
      };

      fetchVouchers();
    }
  }, [isExpanded, vouchers.length]);

  // Handle manual code validation
  const handleValidateManualCode = async () => {
    const code = manualCode.trim().toUpperCase();
    if (!code) {
      setValidationStatus({ type: "error", message: "Vui lòng nhập mã" });
      return;
    }

    setIsValidating(true);
    try {
      // Get cart items for product eligibility validation
      const cartItems = await getCartItemsForDiscount();

      // Step 1: Validate the code (with cart items for product-specific discounts)
      const result = await validateDiscountCode(code, cartItems);
      if (!result.valid) {
        setValidationStatus({
          type: "error",
          message: result.reason || result.message || "Mã không hợp lệ hoặc đã hết hạn",
        });
        toast.error(result.reason || result.message || "Mã không hợp lệ hoặc đã hết hạn");
        return;
      }

      // Step 2: Apply the discount via backend API (with cart items)
      const applied = await applyDiscountWithCart(code);

      if (!applied.applied) {
        setValidationStatus({
          type: "error",
          message: applied.reason || applied.message || "Không thể áp dụng mã giảm giá",
        });
        toast.error(applied.reason || applied.message || "Không thể áp dụng mã giảm giá");
        return;
      }

      // Success!
      setValidationStatus({ type: "success", message: "Mã hợp lệ!" });
      onPromoCodeChange(code);
      onApplyPromo();

      // Notify parent of discount amount (cart will be refreshed to get persisted data)
      onDiscountChange(applied.amount || 0);

      toast.success("Đã áp dụng mã ưu đãi!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể kiểm tra mã";
      setValidationStatus({ type: "error", message });
      toast.error(message);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle voucher card selection
  const handleVoucherSelect = async (voucher: DiscountDTO) => {
    if (!voucher.code) return;

    setIsValidating(true);
    try {
      // Apply the discount via backend API (with cart items)
      const applied = await applyDiscountWithCart(voucher.code);

      if (!applied.applied) {
        setValidationStatus({
          type: "error",
          message: applied.reason || applied.message || "Không thể áp dụng mã giảm giá",
        });
        toast.error(applied.reason || applied.message || "Không thể áp dụng mã giảm giá");
        return;
      }

      // Success!
      setManualCode(voucher.code);
      onPromoCodeChange(voucher.code);
      onApplyPromo();

      // Notify parent of discount amount (cart will be refreshed to get persisted data)
      onDiscountChange(applied.amount || 0);

      setValidationStatus({ type: "success", message: "Đã áp dụng mã!" });
      toast.success(`Đã áp dụng mã ${voucher.code}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể áp dụng mã";
      setValidationStatus({ type: "error", message });
      toast.error(message);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className={className}>
      {/* Header - Always Visible */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`
          flex w-full items-center justify-between rounded-lg border-2
          px-5 py-4 transition-all duration-300
          ${
            isExpanded
              ? "border-[#D4AF37] bg-[#fffcf5]"
              : "border-[#E5E5E5] bg-white hover:border-[#D4AF37]"
          }
        `}
        style={
          isExpanded
            ? { borderColor: STYLES.gold, backgroundColor: STYLES.goldLight }
            : {}
        }
      >
        <div className="flex items-center gap-3">
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: isExpanded ? STYLES.gold : "#F5F5F5" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isExpanded ? "text-white" : "text-[#D4AF37]"}
            >
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M13 5v2" />
              <path d="M13 17v2" />
              <path d="M13 11v2" />
            </svg>
          </div>
          <span
            className={`text-sm font-bold uppercase tracking-[0.15em] ${
              isExpanded ? "text-[#D4AF37]" : "text-black"
            }`}
            style={isExpanded ? { color: STYLES.gold } : {}}
          >
            Bạn có mã ưu đãi?
          </span>
        </div>

        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${
            isExpanded ? "rotate-180 text-[#D4AF37]" : "text-gray-400"
          }`}
          style={isExpanded ? { color: STYLES.gold } : {}}
        />
      </button>

      {/* Expandable Body */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isExpanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}
        `}
      >
        {isExpanded && (
          <div
            className={`
              rounded-lg border-2 bg-white p-4
              ${isExpanded ? "border-[#D4AF37]" : "border-[#E5E5E5]"}
            `}
            style={isExpanded ? { borderColor: STYLES.gold } : {}}
          >
            {/* Scrollable Voucher List */}
            <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3 mb-4">
              {isLoadingVouchers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
                </div>
              ) : vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <VoucherCard
                    key={voucher.id}
                    voucher={voucher}
                    isSelected={promoCode === voucher.code && appliedPromo}
                    onSelect={handleVoucherSelect}
                    subtotal={subtotal}
                  />
                ))
              ) : (
                <div
                  className="text-center py-8 text-xs"
                  style={{ color: STYLES.textMuted }}
                >
                  Không có mã ưu đãi khả dụng
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E5E5E5] my-4" />

            {/* Manual Input Area - Sticky (Not Scrollable) */}
            <div className="space-y-3">
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: STYLES.textMuted }}
              >
                Nhập mã khác
              </label>

              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã giảm giá..."
                  disabled={isValidating}
                  className={`
                    flex-1 rounded-lg border-2 px-4 py-3
                    text-sm font-medium outline-none transition-all
                    ${
                      validationStatus.type === "error"
                        ? "border-[#DC2626] bg-[#FEE2E2] focus:border-[#DC2626]"
                        : validationStatus.type === "success"
                        ? "border-[#10B981] bg-[#F0FDF4] focus:border-[#10B981]"
                        : "border-[#E5E5E5] bg-white focus:border-[#D4AF37]"
                    }
                  `}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleValidateManualCode();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={handleValidateManualCode}
                  disabled={isValidating || !manualCode.trim()}
                  className={`
                    rounded-lg px-6 py-3
                    text-[10px] font-black uppercase tracking-widest
                    transition-all duration-300
                    ${
                      isValidating || !manualCode.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : validationStatus.type === "success"
                        ? "bg-[#10B981] text-white hover:bg-[#059669]"
                        : "bg-black text-white hover:bg-[#D4AF37] hover:text-black"
                    }
                  `}
                >
                  {isValidating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : validationStatus.type === "success" ? (
                    "✓"
                  ) : (
                    "ÁP DỤNG"
                  )}
                </button>
              </div>

              {/* Validation Message */}
              {validationStatus.message && (
                <div
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                    ${
                      validationStatus.type === "error"
                        ? "bg-[#FEE2E2] text-[#DC2626]"
                        : "bg-[#F0FDF4] text-[#10B981]"
                    }
                  `}
                >
                  {validationStatus.type === "error" && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  {validationStatus.type === "success" && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  {validationStatus.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LuxuryVoucherSelector;
