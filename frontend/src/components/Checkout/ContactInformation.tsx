import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInformationProps {
  email: string;
  phone: string;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
  isAuthenticated?: boolean;
}

export function ContactInformation({
  email,
  phone,
  onEmailChange,
  onPhoneChange,
  isAuthenticated = false,
}: ContactInformationProps) {
  // Nếu đã đăng nhập, chỉ hiển thị các trường có dữ liệu
  const showEmail = !isAuthenticated || email.trim() !== "";
  const showPhone = !isAuthenticated || phone.trim() !== "";

  // Nếu đã đăng nhập và không có trường nào cần hiển thị, ẩn cả section
  if (isAuthenticated && !showEmail && !showPhone) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-black">Thông tin liên hệ</h2>
      <div className="space-y-4">
        {showEmail && (
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="mt-1"
              placeholder="your@email.com"
            />
          </div>
        )}
        {showPhone && (
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="mt-1"
              placeholder="0123456789"
            />
          </div>
        )}
        {!isAuthenticated && (
          <p className="text-sm text-gray-600">
            Bạn đã có tài khoản?{" "}
            <a href="/login" className="text-blue-600 underline hover:text-blue-700">
              Đăng nhập
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

