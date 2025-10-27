import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function PromotionBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Parallax Background Image */}
      <div 
        className="absolute inset-0 bg-fixed"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1668453284543-8df7367074eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBmYXNoaW9uJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NjE0MTA5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 
            className="text-white mb-6"
            style={{ fontSize: '48px', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Exclusive Autumn Sale - Up to 40% Off
          </h2>
          <p 
            className="text-white/80 mb-10"
            style={{ fontSize: '18px', lineHeight: 1.6 }}
          >
            Limited time offer on selected premium items from our autumn collection
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-6 mb-12">
            <div className="text-center">
              <div 
                className="text-white mb-2 w-20 h-20 flex items-center justify-center rounded-lg"
                style={{ 
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  border: '2px solid #D4AF37',
                  fontSize: '32px',
                  fontWeight: 700
                }}
              >
                {timeLeft.days}
              </div>
              <div className="text-white/60 text-xs tracking-wider">DAYS</div>
            </div>
            <div className="text-center">
              <div 
                className="text-white mb-2 w-20 h-20 flex items-center justify-center rounded-lg"
                style={{ 
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  border: '2px solid #D4AF37',
                  fontSize: '32px',
                  fontWeight: 700
                }}
              >
                {timeLeft.hours}
              </div>
              <div className="text-white/60 text-xs tracking-wider">HOURS</div>
            </div>
            <div className="text-center">
              <div 
                className="text-white mb-2 w-20 h-20 flex items-center justify-center rounded-lg"
                style={{ 
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  border: '2px solid #D4AF37',
                  fontSize: '32px',
                  fontWeight: 700
                }}
              >
                {timeLeft.minutes}
              </div>
              <div className="text-white/60 text-xs tracking-wider">MINUTES</div>
            </div>
            <div className="text-center">
              <div 
                className="text-white mb-2 w-20 h-20 flex items-center justify-center rounded-lg"
                style={{ 
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  border: '2px solid #D4AF37',
                  fontSize: '32px',
                  fontWeight: 700
                }}
              >
                {timeLeft.seconds}
              </div>
              <div className="text-white/60 text-xs tracking-wider">SECONDS</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="px-10 py-6 text-black uppercase tracking-wider hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: '#D4AF37',
                fontSize: '16px',
                fontWeight: 600,
                letterSpacing: '1px'
              }}
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
