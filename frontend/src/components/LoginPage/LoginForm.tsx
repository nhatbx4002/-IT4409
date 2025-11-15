import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="relative z-10 w-full max-w-[460px] mx-auto px-4 sm:px-6"
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
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="mb-2"
          style={{
            fontFamily: "Playfair Display",
            fontSize: "clamp(24px, 5vw, 32px)",
            fontWeight: 700,
            color: "#111111",
          }}
        >
          Login
        </h1>
        <p
          style={{
            fontFamily: "Poppins",
            fontSize: "14px",
            fontWeight: 400,
            color: "#6B7280",
          }}
        >
          Enter your email and password to continue
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5 sm:space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 600,
              color: "#111111",
            }}
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
            <input
              id="email"
              type="email"
              placeholder="abc@gmail.com"
              className="w-full h-[52px] bg-[rgba(243,244,246,0.5)] border border-[#E5E7EB] rounded-lg pl-12 pr-4 transition-all focus:outline-none focus:border-2 focus:border-[#D4AF37] focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)]"
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                color: "#111111",
              }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 600,
                color: "#111111",
              }}
            >
              Password
            </label>
            <a
              href="#"
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 500,
                color: "#D4AF37",
                textDecoration: "none",
              }}
              className="hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full h-[52px] bg-[rgba(243,244,246,0.5)] border border-[#E5E7EB] rounded-lg pl-12 pr-12 transition-all focus:outline-none focus:border-2 focus:border-[#D4AF37] focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)]"
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                color: "#111111",
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
        </div>

        {/* Remember Me */}
        <div className="flex items-center my-5">
          <Checkbox
            id="remember"
            className="w-5 h-5 rounded border-2 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
          />
          <label
            htmlFor="remember"
            className="ml-2 cursor-pointer select-none"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 400,
              color: "#6B7280",
            }}
          >
            Remember me for 30 days
          </label>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full h-[52px] rounded-lg transition-all hover:-translate-y-0.5"
          style={{
            background: "#D4AF37",
            border: "none",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontWeight: 600,
            color: "#1A1A1A",
            letterSpacing: "1px",
            textTransform: "uppercase",
            boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#C5A100";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#D4AF37";
          }}
        >
          SIGN IN
        </button>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]"></div>
          </div>
          <div className="relative flex justify-center">
            <span
              className="bg-white px-4"
              style={{
                fontFamily: "Poppins",
                fontSize: "13px",
                color: "#9CA3AF",
              }}
            >
              or
            </span>
          </div>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          className="w-full h-[52px] bg-[rgba(255,255,255,0.6)] border-[1.5px] border-[#E5E7EB] rounded-lg flex items-center justify-center gap-3 transition-all hover:bg-white hover:border-[#D4AF37]"
          style={{
            fontFamily: "Poppins",
            fontSize: "15px",
            fontWeight: 500,
            color: "#111111",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.8055 10.2292C19.8055 9.55157 19.7501 8.86854 19.6297 8.19775H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0875V17.5866H16.8251C18.7175 15.8449 19.8055 13.2728 19.8055 10.2292Z"
              fill="#4285F4"
            />
            <path
              d="M10.2002 20.0006C12.9515 20.0006 15.2664 19.1151 16.8298 17.5865L13.6071 15.0874C12.7077 15.6971 11.5467 16.0426 10.2049 16.0426C7.5441 16.0426 5.29056 14.2828 4.50516 11.9163H1.18359V14.4922C2.78772 17.6718 6.31069 20.0006 10.2002 20.0006Z"
              fill="#34A853"
            />
            <path
              d="M4.50042 11.9162C4.08462 10.6743 4.08462 9.33016 4.50042 8.08825V5.51233H1.18354C-0.395017 8.65749 -0.395017 12.3469 1.18354 15.4921L4.50042 11.9162Z"
              fill="#FBBC04"
            />
            <path
              d="M10.2002 3.95805C11.6209 3.93602 13.0001 4.47222 14.0409 5.45722L16.8945 2.60362C15.1809 0.990667 12.9328 0.0913881 10.2002 0.118418C6.31069 0.118418 2.78772 2.44727 1.18359 5.6269L4.50047 8.20282C5.28117 5.83166 7.53941 3.95805 10.2002 3.95805Z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <div className="text-center mt-10">
          <span
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#6B7280",
            }}
          >
            Don't have an account?{" "}
          </span>
          <a
            href="#"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 600,
              color: "#D4AF37",
              textDecoration: "none",
            }}
            className="hover:underline"
          >
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
}
