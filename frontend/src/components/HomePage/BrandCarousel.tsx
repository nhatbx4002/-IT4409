import { useState } from "react";

export function BrandCarousel() {
  const brands = [
    "VERSACE",
    "ARMANI",
    "GUCCI",
    "PRADA",
    "DIOR",
    "CHANEL",
    "HERMÈS",
    "BURBERRY",
    "VALENTINO",
    "FENDI"
  ];

  const [isPaused, setIsPaused] = useState(false);

  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-white border-y border-black/10 .scrollbar-hide">
      <div className="max-w-full mx-auto px-30">
        <div className="text-center mb-12">
          <h2 
            className="mb-4"
            style={{ fontSize: '36px', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Our Premium Brands
          </h2>
          <div className="w-24 h-0.5 mx-auto" style={{ backgroundColor: '#D4AF37' }}></div>
        </div>
        
        {/* Brand Logos - Infinite auto-scrolling carousel */}
        <div className="overflow-hidden relative">
          <div 
            className="flex gap-12 items-center"
            style={{
              animation: isPaused ? 'none' : 'scroll 30s linear infinite',
              width: 'fit-content'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedBrands.map((brand, index) => (
              <div 
                key={index}
                className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer group shrink-0"
              >
                <span 
                  className="text-2xl tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                  style={{ 
                    color: '#666666',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 400
                  }}
                >
                  {brand}
                </span>
              </div>
            ))}
          </div>

          {/* Gradient overlays for smooth edge fade */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, white, transparent)'
            }}
          ></div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, white, transparent)'
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
}
