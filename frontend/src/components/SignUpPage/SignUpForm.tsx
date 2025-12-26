import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Check,
  AlertCircle,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { signUp } from "@/lib/api";

const signUpSchema = z
  .object({
    firstName: z.string().min(1, "Vui lòng nhập tên"),
    lastName: z.string().min(1, "Vui lòng nhập họ"),
    email: z.string().email("Vui lòng nhập địa chỉ email hợp lệ"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[a-z]/, "Mật khẩu phải có ít nhất một chữ thường")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ hoa")
      .regex(/\d/, "Mật khẩu phải có ít nhất một số"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản và chính sách",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      terms: false,
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password || "");
  const strengthColors = ["#EF4444", "#F59E0B", "#EAB308", "#22C55E"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const passwordsMatch =
    confirmPassword &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Combine firstName + lastName thành name
      const name = `${data.firstName} ${data.lastName}`;

      const response = await signUp({
        email: data.email,
        name,
        password: data.password,
        phone: data.phone || undefined,
      });

      // Auto login sau khi signup thành công
      // Note: Backend không trả về token trong signUp response, nên có thể cần gọi signIn
      // Hoặc redirect về login page
      navigate("/login", {
        state: { message: "Tạo tài khoản thành công! Vui lòng đăng nhập." },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Sign up failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative z-10 w-full max-w-[540px] mx-auto px-4 sm:px-6"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "20px",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)",
        padding: "clamp(24px, 5vw, 40px)",
      }}
    >
      {/* Form Header */}
      <div className="text-center mb-8">
        <p
          className="mb-2"
          style={{
            fontFamily: "Poppins",
            fontSize: "12px",
            fontWeight: 600,
            color: "#D4AF37",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Bắt đầu hành trình của bạn
        </p>
        <h1
          className="mb-2"
          style={{
            fontFamily: "Playfair Display",
            fontSize: "clamp(24px, 5vw, 32px)",
            fontWeight: 700,
            color: "#000000",
          }}
        >
          Tạo tài khoản
        </h1>
        <p
          style={{
            fontFamily: "Poppins",
            fontSize: "14px",
            fontWeight: 400,
            color: "#6B7280",
          }}
        >
          Tham gia cộng đồng thời trang Aristino
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-4 p-3 rounded-lg flex items-center gap-2"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#DC2626",
            }}
          >
            {error}
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-[18px] sm:space-y-5"
      >
        {/* First Name + Last Name (2 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block mb-2"
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 600,
                color: "#000000",
              }}
            >
              Tên
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
              <input
                id="firstName"
                type="text"
                placeholder="Tên của bạn"
                {...register("firstName")}
                className={`w-full h-[52px] bg-[#F8F9FA] border-[1.5px] rounded-lg pl-12 pr-4 transition-all focus:outline-none focus:border-2 focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)] ${
                  errors.firstName
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#E5E7EB] focus:border-[#D4AF37]"
                }`}
                style={{
                  fontFamily: "Poppins",
                  fontSize: "15px",
                  color: "#000000",
                }}
              />
            </div>
            {errors.firstName && (
              <p
                className="mt-1"
                style={{
                  fontFamily: "Poppins",
                  fontSize: "12px",
                  color: "#DC2626",
                }}
              >
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block mb-2"
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 600,
                color: "#000000",
              }}
            >
              Họ
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
              <input
                id="lastName"
                type="text"
                placeholder="Họ của bạn"
                {...register("lastName")}
                className={`w-full h-[52px] bg-[#F8F9FA] border-[1.5px] rounded-lg pl-12 pr-4 transition-all focus:outline-none focus:border-2 focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)] ${
                  errors.lastName
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#E5E7EB] focus:border-[#D4AF37]"
                }`}
                style={{
                  fontFamily: "Poppins",
                  fontSize: "15px",
                  color: "#000000",
                }}
              />
            </div>
            {errors.lastName && (
              <p
                className="mt-1"
                style={{
                  fontFamily: "Poppins",
                  fontSize: "12px",
                  color: "#DC2626",
                }}
              >
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 600,
              color: "#000000",
            }}
          >
            Địa chỉ Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
            <input
              id="email"
              type="email"
              placeholder="abc@gmail.com"
              {...register("email")}
              className={`w-full h-[52px] bg-[#F8F9FA] border-[1.5px] rounded-lg pl-12 pr-4 transition-all focus:outline-none focus:border-2 focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)] ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#E5E7EB] focus:border-[#D4AF37]"
              }`}
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                color: "#000000",
              }}
            />
          </div>
          {errors.email && (
            <p
              className="mt-1"
              style={{
                fontFamily: "Poppins",
                fontSize: "12px",
                color: "#DC2626",
              }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block mb-2"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 600,
              color: "#000000",
            }}
          >
            Số điện thoại (không bắt buộc)
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
            <select
              className="absolute left-12 top-1/2 -translate-y-1/2 bg-transparent border-none outline-none"
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                color: "#000000",
                cursor: "pointer",
              }}
            >
              <option>+1</option>
              <option>+44</option>
              <option>+91</option>
            </select>
            <input
              id="phone"
              type="tel"
              placeholder="Số điện thoại của bạn"
              {...register("phone")}
              className={`w-full h-[52px] bg-[#F8F9FA] border-[1.5px] rounded-lg pl-24 pr-4 transition-all focus:outline-none focus:border-2 focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)] ${
                errors.phone
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#E5E7EB] focus:border-[#D4AF37]"
              }`}
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                color: "#000000",
              }}
            />
          </div>
          {errors.phone && (
            <p
              className="mt-1"
              style={{
                fontFamily: "Poppins",
                fontSize: "12px",
                color: "#DC2626",
              }}
            >
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Create Password */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 600,
              color: "#000000",
            }}
          >
            Tạo mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Tạo mật khẩu mạnh"
              {...register("password")}
              className={`w-full h-[52px] bg-[#F8F9FA] border-[1.5px] rounded-lg pl-12 pr-12 transition-all focus:outline-none focus:border-2 focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)] ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#E5E7EB] focus:border-[#D4AF37]"
              }`}
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                color: "#000000",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>

          {/* Password Strength Bar */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="h-1 flex-1 rounded-sm transition-all"
                    style={{
                      background:
                        index < passwordStrength
                          ? strengthColors[passwordStrength - 1]
                          : "#E5E7EB",
                    }}
                  />
                ))}
              </div>
              {passwordStrength > 0 && (
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "12px",
                    color: strengthColors[passwordStrength - 1],
                  }}
                >
                  Độ mạnh mật khẩu: {strengthLabels[passwordStrength - 1] === "Weak" ? "Yếu" : strengthLabels[passwordStrength - 1] === "Fair" ? "Trung bình" : strengthLabels[passwordStrength - 1] === "Good" ? "Tốt" : "Mạnh"}
                </p>
              )}
            </div>
          )}
          {errors.password && (
            <p
              className="mt-1"
              style={{
                fontFamily: "Poppins",
                fontSize: "12px",
                color: "#DC2626",
              }}
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block mb-2"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 600,
              color: "#000000",
            }}
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              {...register("confirmPassword")}
              className={`w-full h-[52px] bg-[#F8F9FA] border-[1.5px] rounded-lg pl-12 pr-12 transition-all focus:outline-none focus:border-2 focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)] ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#E5E7EB] focus:border-[#D4AF37]"
              }`}
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                color: "#000000",
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
            {passwordsMatch && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <Check className="w-[18px] h-[18px] text-[#22C55E]" />
              </div>
            )}
          </div>
          {errors.confirmPassword && (
            <p
              className="mt-1"
              style={{
                fontFamily: "Poppins",
                fontSize: "12px",
                color: "#DC2626",
              }}
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2 pt-2">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="w-5 h-5 rounded border-2 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37] mt-0.5"
              />
            )}
          />
          <label
            htmlFor="terms"
            className="cursor-pointer select-none"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 400,
              color: "#6B7280",
              lineHeight: "1.5",
            }}
          >
            Tôi đồng ý với
            <a
              href="#"
              className="hover:underline"
              style={{ color: "#D4AF37", textDecoration: "underline" }}
            >
              Điều khoản dịch vụ
            </a>
            và
            <a
              href="#"
              className="hover:underline"
              style={{ color: "#D4AF37", textDecoration: "underline" }}
            >
              Chính sách bảo mật
            </a>
          </label>
          {errors.terms && (
            <p
              className="mt-1 ml-7"
              style={{
                fontFamily: "Poppins",
                fontSize: "12px",
                color: "#DC2626",
              }}
            >
              {errors.terms.message}
            </p>
          )}
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[52px] rounded-lg transition-all hover:-translate-y-0.5 mt-6 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{
            background: isLoading ? "#C5A100" : "#D4AF37",
            border: "none",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontWeight: 700,
            color: "#000000",
            letterSpacing: "1px",
            textTransform: "uppercase",
            boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = "#C5A100";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = "#D4AF37";
            }
          }}
        >
          {isLoading ? "ĐANG TẠO TÀI KHOẢN..." : "TẠO TÀI KHOẢN"}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]"></div>
          </div>
          <div className="relative flex justify-center">
            <span
              className="bg-white px-4"
              style={{
                fontFamily: "Poppins",
                fontSize: "12px",
                fontWeight: 500,
                color: "#9CA3AF",
                letterSpacing: "0.5px",
              }}
            >
              HOẶC ĐĂNG KÝ BẰNG
            </span>
          </div>
        </div>

        {/* Social Signup Buttons (2 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Google Button */}
          <button
            type="button"
            className="h-12 bg-white border-[1.5px] border-[#E5E7EB] rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-[#F9FAFB] hover:border-[#D4AF37]"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 500,
              color: "#000000",
              cursor: "pointer",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.8249 9.20628C17.8249 8.59641 17.7751 7.98152 17.6667 7.37798H9.18018V10.844H14.0413C13.8497 11.9599 13.1914 12.9509 12.2422 13.5788V15.8279H15.1426C16.8457 14.2604 17.8249 11.9452 17.8249 9.20628Z"
                fill="#4285F4"
              />
              <path
                d="M9.18018 18.0005C11.6563 18.0005 13.7397 17.2036 15.1468 15.8279L12.2464 13.5788C11.437 14.1276 10.3921 14.4384 9.18396 14.4384C6.78971 14.4384 4.76151 12.8549 4.05464 10.7247H1.06523V13.043C2.50895 15.9046 5.67962 18.0005 9.18018 18.0005Z"
                fill="#34A853"
              />
              <path
                d="M4.05038 10.7246C3.67616 9.6087 3.67616 8.39715 4.05038 7.28123V4.96313H1.06473C-0.355516 7.79174 -0.355516 11.2141 1.06473 14.0427L4.05038 10.7246Z"
                fill="#FBBC04"
              />
              <path
                d="M9.18018 3.56225C10.4587 3.54242 11.7001 4.02499 12.6368 4.91149L15.2051 2.34325C13.6629 0.891601 11.6389 0.0822492 9.18018 0.106557C5.67962 0.106557 2.50895 2.20254 1.06523 5.06897L4.05088 7.38707C4.75396 5.25189 6.78594 3.56225 9.18018 3.56225Z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            className="h-12 bg-white border-[1.5px] border-[#E5E7EB] rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-[#F9FAFB] hover:border-[#D4AF37]"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 500,
              color: "#000000",
              cursor: "pointer",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4922 3.29116 17.2155 7.59375 17.8907V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.93719 3.51562 10.9932 3.51562C11.9776 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.60006 10.4062 7.3125V9H12.9023L12.5033 11.6016H10.4062V17.8907C14.7088 17.2155 18 13.4922 18 9Z"
                fill="#1877F2"
              />
            </svg>
            Facebook
          </button>
        </div>

        {/* Sign In Link */}
        <div className="text-center pt-4">
          <span
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#6B7280",
            }}
          >
            Đã có tài khoản? 
          </span>
          <Link
            to="/login"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 600,
              color: "#D4AF37",
              textDecoration: "none",
            }}
            className="hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}
