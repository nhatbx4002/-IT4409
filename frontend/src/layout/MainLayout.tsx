import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { Toaster as Sonner } from "sonner";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white max-w-full overflow-x-hidden scroll-smooth">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <Sonner position="top-center" />
    </div>
  );
}
