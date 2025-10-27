import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";


export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 group transition-all duration-500 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-16 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      {/* Button container with shadow and glow */}
      <div 
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-2xl"
        style={{
          backgroundColor: '#D4AF37',
          boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
        }}
      >
        {/* Pulsing ring effect */}
        <div 
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            backgroundColor: '#D4AF37',
            opacity: 0.2,
            animationDuration: '2s'
          }}
        ></div>
        
        {/* Hover glow effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            backgroundColor: '#D4AF37',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.6), 0 0 60px rgba(212, 175, 55, 0.4)'
          }}
        ></div>

        {/* Icon */}
        <ArrowUp 
          className="relative z-10 text-black transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" 
          size={24}
          strokeWidth={2.5}
        />
      </div>

      {/* Tooltip */}
      <div 
        className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-sm text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0"
        style={{
          backgroundColor: '#000',
          color: '#D4AF37'
        }}
      >
        Back to Top
        {/* Arrow */}
        <div 
          className="absolute top-full right-6 w-0 h-0"
          style={{
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '4px solid #000'
          }}
        ></div>
      </div>
    </button>
  );
}
