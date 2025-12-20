import { useState, useEffect, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { PROVINCES, getDistrictsByProvince, getWardsByDistrict } from "@/data/vietnamAddresses";
import { getShippingFee } from "@/lib/api";
import { Loader2, Search, X, ChevronDown } from "lucide-react";

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
  const [citySearch, setCitySearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [wardOpen, setWardOpen] = useState(false);

  // Filter provinces by search
  const filteredProvinces = useMemo(() => {
    return PROVINCES.filter((p) =>
      p.name.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [citySearch]);

  // Filter districts by search
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) =>
      d.name.toLowerCase().includes(districtSearch.toLowerCase())
    );
  }, [districts, districtSearch]);

  // Filter wards by search
  const filteredWards = useMemo(() => {
    return wards.filter((w) =>
      w.name.toLowerCase().includes(wardSearch.toLowerCase())
    );
  }, [wards, wardSearch]);

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
          <Label htmlFor="full_name" className="text-xs font-light tracking-wide text-gray-600 uppercase">
            Họ và tên
          </Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => onFormChange("full_name", e.target.value)}
            className="mt-3 px-4 py-2.5"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-xs font-light tracking-wide text-gray-600 uppercase">
            Số điện thoại
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onFormChange("phone", e.target.value)}
            className="mt-3 px-4 py-2.5"
            placeholder="0123456789"
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-xs font-light tracking-wide text-gray-600 uppercase">
            Địa chỉ chi tiết
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onFormChange("address", e.target.value)}
            className="mt-3 px-4 py-2.5"
            placeholder="Số nhà, tên đường..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="city" className="text-xs font-light tracking-wide text-gray-600 uppercase">
              Tỉnh/Thành phố
            </Label>
            <Popover open={cityOpen} onOpenChange={setCityOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="city"
                  variant="outline"
                  className="w-full mt-3 justify-between text-left font-normal"
                  disabled={false}
                >
                  <span className={selectedProvince ? "text-black" : "text-gray-400"}>
                    {selectedProvince?.name || "Chọn tỉnh/thành phố"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm tỉnh/thành phố..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="pl-9 h-9 text-sm"
                      autoFocus
                    />
                    {citySearch && (
                      <button
                        onClick={() => setCitySearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <ScrollArea className="h-64">
                  {filteredProvinces.length > 0 ? (
                    <div className="divide-y">
                      {filteredProvinces.map((province) => (
                        <button
                          key={province.id}
                          onClick={() => {
                            onFormChange("city", province.id);
                            setCitySearch("");
                            setCityOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 hover:text-black transition-colors"
                        >
                          {province.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      Không tìm thấy kết quả
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="district" className="text-xs font-light tracking-wide text-gray-600 uppercase">
              Quận/Huyện
            </Label>
            <Input
              id="district"
              value={formData.district}
              onChange={(e) => onFormChange("district", e.target.value)}
              className="mt-3 px-4 py-2.5"
              placeholder="Nhập quận/huyện"
              disabled={!formData.city}
            />
          </div>

          <div>
            <Label htmlFor="ward" className="text-xs font-light tracking-wide text-gray-600 uppercase">
              Phường/Xã
            </Label>
            <Input
              id="ward"
              value={formData.ward}
              onChange={(e) => onFormChange("ward", e.target.value)}
              className="mt-3 px-4 py-2.5"
              placeholder="Nhập phường/xã"
              disabled={!formData.district}
            />
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
            className="text-xs font-light tracking-wide text-gray-600 uppercase cursor-pointer"
          >
            Đặt làm địa chỉ mặc định
          </Label>
        </div>
      </div>
    </div>
  );
}

