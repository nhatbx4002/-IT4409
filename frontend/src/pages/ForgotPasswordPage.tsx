import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { sendOTP, verifyOTP } from "@/lib/api";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BackToTop } from "@/components/BackToTop";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendOTP(data.email);
      setEmail(data.email);
      setStep("otp");
      setSuccess("OTP has been sent to your email");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await verifyOTP(email, data.otp);
      navigate(`/reset-password?token=${encodeURIComponent(result.token)}&email=${encodeURIComponent(email)}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid or expired OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendOTP(email);
      setSuccess("OTP has been resent to your email");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend OTP. Please try again.";
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
                {step === "email" ? "Forgot Password?" : "Verify OTP"}
              </h1>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                {step === "email"
                  ? "Enter your email address and we'll send you an OTP to reset your password"
                  : `Enter the 6-digit OTP sent to ${email}`}
              </p>
            </div>

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
                <p
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    color: "#16A34A",
                  }}
                >
                  {success}
                </p>
              </div>
            )}

            {/* Email Step Form */}
            {step === "email" && (
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#111111",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...emailForm.register("email")}
                      className={`w-full h-[52px] bg-[rgba(243,244,246,0.5)] border rounded-lg pl-12 pr-4 transition-all focus:outline-none focus:border-2 focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)] ${
                        emailForm.formState.errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#E5E7EB] focus:border-[#D4AF37]"
                      }`}
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "15px",
                        color: "#111111",
                      }}
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p
                      className="mt-2"
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        color: "#DC2626",
                      }}
                    >
                      {emailForm.formState.errors.email.message}
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
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* OTP Step Form */}
            {step === "otp" && (
              <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#111111",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    {...otpForm.register("otp")}
                    className={`w-full h-[52px] bg-[rgba(243,244,246,0.5)] border rounded-lg px-4 text-center text-2xl tracking-widest transition-all focus:outline-none focus:border-2 focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.1)] ${
                      otpForm.formState.errors.otp
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#E5E7EB] focus:border-[#D4AF37]"
                    }`}
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "24px",
                      color: "#111111",
                      letterSpacing: "0.5em",
                    }}
                  />
                  {otpForm.formState.errors.otp && (
                    <p
                      className="mt-2"
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        color: "#DC2626",
                      }}
                    >
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
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
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="w-full h-[52px] rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed border-2"
                    style={{
                      background: "transparent",
                      borderColor: "#D4AF37",
                      fontFamily: "Poppins",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#D4AF37",
                    }}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
