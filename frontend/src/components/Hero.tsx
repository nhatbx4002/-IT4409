import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '80vh' }}>
      {/* Hero Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1760264558913-81340fda5fba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50fGVufDF8fHx8MTc2MTMyNzExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Luxury Fashion Model"
          className="w-full h-full object-cover"
        />
        {/* Vignette Overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)'
          }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="max-w-2xl">
          <div className="mb-6">
            <span 
              className="text-sm tracking-[0.3em] uppercase"
              style={{ color: '#D4AF37' }}
            >
              Autumn Collection 2025
            </span>
          </div>
          <h1 
            className="text-white mb-6 leading-tight"
            style={{ fontSize: '54px', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            Luxury Fashion<br />
            for Modern<br />
            Gentlemen
          </h1>
          <p 
            className="text-white/90 mb-10 max-w-lg"
            style={{ fontSize: '18px', lineHeight: 1.6 }}
          >
            Discover premium menswear that combines timeless elegance with contemporary style. Crafted for those who appreciate quality and sophistication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="px-10 py-6 text-black uppercase tracking-wider hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: '#D4AF37',
                fontSize: '16px',
                fontWeight: 600,
                letterSpacing: '1px'
              }}
            >
              Explore Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 animate-bounce">
        <ChevronDown className="h-6 w-6" />
      </div>
    </section>
  );
}
