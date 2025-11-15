import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginPage/LoginForm";
import { Navbar } from "@/components/Navbar";
import { BackToTop } from "@/components/BackToTop";

export default function LoginPage() {
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
        {/* Circle 1 - Gold - Top Right */}
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

        {/* Circle 2 - Purple - Bottom Left */}
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

        {/* Circle 3 - Blue - Center Right */}
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
        <LoginForm />
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
