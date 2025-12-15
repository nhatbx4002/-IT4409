import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PROVINCES, getDistrictsByProvince, getWardsByDistrict } from "@/data/vietnamAddresses";
import { getShippingFee } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface ShippingAddressFormProps {
  formData: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    is_default: boolean;
  };
  onFormChange: (field: string, value: string | boolean) => void;
  onShippingFeeUpdate: (fee: number, note: string, discount: number) => void;
  promoCode: string;
  subtotal: number;
}

export function ShippingAddressForm({
  formData,
  onFormChange,
  onShippingFeeUpdate,
  promoCode,
  subtotal,
}: ShippingAddressFormProps) {
  const [districts, setDistricts] = useState<ReturnType<typeof getDistrictsByProvince>>([]);
  const [wards, setWards] = useState<ReturnType<typeof getWardsByDistrict>>([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Update districts when city changes
  useEffect(() => {
    if (formData.city) {
      const cityDistricts = getDistrictsByProvince(formData.city);
      setDistricts(cityDistricts);
      // Reset district and ward when city changes
      if (formData.district && !cityDistricts.find((d) => d.id === formData.district)) {
        onFormChange("district", "");
        onFormChange("ward", "");
      }
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [formData.city]);

  // Update wards when district changes
  useEffect(() => {
    if (formData.district) {
      const districtWards = getWardsByDistrict(formData.district);
      setWards(districtWards);
      // Reset ward when district changes
      if (formData.ward && !districtWards.find((w) => w.id === formData.ward)) {
        onFormChange("ward", "");
      }
    } else {
      setWards([]);
    }
  }, [formData.district]);

  // Calculate shipping fee when province and district are selected
  useEffect(() => {
    if (formData.city && formData.district) {
      const calculateShipping = async () => {
        setIsCalculatingShipping(true);
        try {
          const result = await getShippingFee(formData.city, formData.district, promoCode || undefined);
          onShippingFeeUpdate(result.shippingFee, result.shippingNote, result.discountAmount);
        } catch (error) {
          console.error("Failed to calculate shipping fee:", error);
          // Set default shipping fee
          onShippingFeeUpdate(50000, "Phí vận chuyển", 0);
        } finally {
          setIsCalculatingShipping(false);
        }
      };

      // Debounce the API call
      const timeoutId = setTimeout(calculateShipping, 500);
      return () => clearTimeout(timeoutId);
    } else {
      onShippingFeeUpdate(0, "Vui lòng nhập địa chỉ", 0);
    }
  }, [formData.city, formData.district, promoCode, onShippingFeeUpdate]);

  const selectedProvince = PROVINCES.find((p) => p.id === formData.city);
  const selectedDistrict = districts.find((d) => d.id === formData.district);
  const selectedWard = wards.find((w) => w.id === formData.ward);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-black">Địa chỉ giao hàng</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
            Họ và tên
          </Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => onFormChange("full_name", e.target.value)}
            className="mt-1"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Số điện thoại
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onFormChange("phone", e.target.value)}
            className="mt-1"
            placeholder="0123456789"
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Địa chỉ chi tiết
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onFormChange("address", e.target.value)}
            className="mt-1"
            placeholder="Số nhà, tên đường..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              Tỉnh/Thành phố
            </Label>
            <Select
              value={formData.city}
              onValueChange={(value) => onFormChange("city", value)}
            >
              <SelectTrigger className="mt-1" id="city">
                <SelectValue placeholder="Chọn tỉnh/thành phố" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="district" className="text-sm font-medium text-gray-700">
              Quận/Huyện
            </Label>
            {districts.length > 0 ? (
              <Select
                value={formData.district}
                onValueChange={(value) => onFormChange("district", value)}
                disabled={!formData.city}
              >
                <SelectTrigger className="mt-1" id="district">
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => onFormChange("district", e.target.value)}
                className="mt-1"
                placeholder="Nhập quận/huyện"
                disabled={!formData.city}
              />
            )}
          </div>

          <div>
            <Label htmlFor="ward" className="text-sm font-medium text-gray-700">
              Phường/Xã
            </Label>
            {wards.length > 0 ? (
              <Select
                value={formData.ward}
                onValueChange={(value) => onFormChange("ward", value)}
                disabled={!formData.district}
              >
                <SelectTrigger className="mt-1" id="ward">
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((ward) => (
                    <SelectItem key={ward.id} value={ward.id}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="ward"
                value={formData.ward}
                onChange={(e) => onFormChange("ward", e.target.value)}
                className="mt-1"
                placeholder="Nhập phường/xã"
                disabled={!formData.district}
              />
            )}
          </div>
        </div>

        {isCalculatingShipping && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Đang tính phí vận chuyển...</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_default"
            checked={formData.is_default}
            onCheckedChange={(checked) => onFormChange("is_default", checked === true)}
          />
          <Label
            htmlFor="is_default"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Đặt làm địa chỉ mặc định
          </Label>
        </div>
      </div>
    </div>
  );
}

