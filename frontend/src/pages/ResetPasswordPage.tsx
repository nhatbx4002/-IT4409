import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/lib/api";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BackToTop } from "@/components/BackToTop";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!tokenParam) {
      setError("Invalid or missing reset token. Please request a new password reset.");
    } else {
      setToken(tokenParam);
      setEmail(emailParam);
    }
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Invalid reset token. Please request a new password reset.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await resetPassword(token, data.password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reset password. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="relative flex items-center justify-center overflow-hidden w-full py-8 sm:py-12"
        style={{
          minHeight: "calc(100vh - 80px)",
          paddingTop: "clamp(100px, 12vh, 120px)",
          paddingBottom: "clamp(40px, 6vh, 60px)",
          background: "linear-gradient(135deg, #FAFBFC 0%, #F0F1F3 100%)",
        }}
      >
        {/* Blur Circles for Glassmorphism Effect */}
        <div
          className="absolute rounded-full hidden sm:block"
          style={{
            width: "clamp(300px, 35vw, 500px)",
            height: "clamp(300px, 35vw, 500px)",
            background: "#D4AF37",
            opacity: 0.2,
            filter: "blur(120px)",
            top: "200px",
            right: "clamp(20px, 7vw, 100px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute rounded-full hidden sm:block"
          style={{
            width: "clamp(250px, 28vw, 400px)",
            height: "clamp(250px, 28vw, 400px)",
            background: "#A855F7",
            opacity: 0.15,
            filter: "blur(100px)",
            bottom: "-100px",
            left: "clamp(-50px, -3vw, -50px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute rounded-full hidden sm:block"
          style={{
            width: "clamp(200px, 21vw, 300px)",
            height: "clamp(200px, 21vw, 300px)",
            background: "#3B82F6",
            opacity: 0.1,
            filter: "blur(80px)",
            top: "50%",
            right: "clamp(20px, 10vw, 150px)",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* Glassmorphic Form Card */}
        <div
          className="relative w-full max-w-md mx-auto px-4 sm:px-6"
          style={{
            zIndex: 10,
          }}
        >
          <div
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20"
            style={{
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)",
            }}
          >
            {/* Back Button */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 mb-6 text-sm"
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 500,
                color: "#6B7280",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1
                style={{
                  fontFamily: "Playfair Display",
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#111111",
                  marginBottom: "8px",
                }}
              >
                Reset Password
              </h1>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                {email ? `Enter your new password for ${email}` : "Enter your new password"}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div
                className="mb-6 p-4 rounded-lg flex items-center gap-3"
                style={{
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#16A34A",
                      marginBottom: "4px",
                    }}
                  >
                    Password reset successful!
                  </p>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "12px",
                      color: "#16A34A",
                    }}
                  >
                    Redirecting to login page...
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                className="mb-6 p-4 rounded-lg flex items-center gap-3"
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                }}
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
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
            {!success && token && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* New Password */}
                <div>
                  <label
                    htmlFor="password"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#111111",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      {...register("password")}
                      className={`w-full h-[52px] bg-[rgba(243,244,246,0.5)] border rounded-lg pl-12 pr-12 transition-all focus:outline-none focus:border-2 focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)] ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#E5E7EB] focus:border-[#D4AF37]"
                      }`}
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "15px",
                        color: "#111111",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      className="mt-2"
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
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#111111",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      {...register("confirmPassword")}
                      className={`w-full h-[52px] bg-[rgba(243,244,246,0.5)] border rounded-lg pl-12 pr-12 transition-all focus:outline-none focus:border-2 focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)] ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#E5E7EB] focus:border-[#D4AF37]"
                      }`}
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "15px",
                        color: "#111111",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p
                      className="mt-2"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[52px] rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: "#D4AF37",
                    fontFamily: "Poppins",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1A1A1A",
                  }}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* No Token Message */}
            {!token && !success && (
              <div className="text-center">
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    color: "#6B7280",
                  }}
                >
                  Invalid or missing reset token.
                </p>
                <Link
                  to="/forgot-password"
                  className="inline-block"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#D4AF37",
                    textDecoration: "none",
                  }}
                >
                  Request a new password reset
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
