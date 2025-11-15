import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Facebook, Instagram, Twitter, Youtube, Truck, Gift, Shield, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h3 
              className="text-white mb-4"
              style={{ fontSize: '36px', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            >
              Join Our Exclusive Club
            </h3>
            <p 
              className="text-white/70 mb-8"
              style={{ fontSize: '18px', lineHeight: 1.6 }}
            >
              Get 10% off your first order and be the first to know about new collections
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-10">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#D4AF37] py-6"
              />
              <Button 
                className="px-10 py-6 text-black uppercase tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap"
                style={{ 
                  backgroundColor: '#D4AF37',
                  fontSize: '16px',
                  fontWeight: 600,
                  letterSpacing: '1px'
                }}
              >
                Subscribe
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                >
                  <Truck className="h-6 w-6" style={{ color: '#D4AF37' }} />
                </div>
                <p className="text-sm text-white/70">Free Shipping</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                >
                  <Gift className="h-6 w-6" style={{ color: '#D4AF37' }} />
                </div>
                <p className="text-sm text-white/70">Exclusive Offers</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                >
                  <Mail className="h-6 w-6" style={{ color: '#D4AF37' }} />
                </div>
                <p className="text-sm text-white/70">Style Tips</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About Us */}
          <div>
            <h2 
              className="text-2xl mb-6" 
              style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}
            >
              ARISTINO
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Curating timeless luxury fashion for discerning individuals who appreciate quality and elegance.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-6 tracking-wider text-sm">CUSTOMER SERVICE</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Help & Contact</a></li>
              <li><a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Returns & Exchanges</a></li>
              <li><a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Shipping Information</a></li>
              <li><a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Size Guide</a></li>
              <li><a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Track Your Order</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 tracking-wider text-sm">QUICK LINKS</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">My Account</a></li>
              <li><a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Order History</a></li>
              <li><a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Wishlist</a></li>
              <li><a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">Store Locator</a></li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="mb-6 tracking-wider text-sm">PAYMENT METHODS</h4>
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-white/10 rounded p-2 flex items-center justify-center text-xs text-white/60">
                VISA
              </div>
              <div className="bg-white/10 rounded p-2 flex items-center justify-center text-xs text-white/60">
                MC
              </div>
              <div className="bg-white/10 rounded p-2 flex items-center justify-center text-xs text-white/60">
                AMEX
              </div>
              <div className="bg-white/10 rounded p-2 flex items-center justify-center text-xs text-white/60">
                PP
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Shield className="h-4 w-4" style={{ color: '#D4AF37' }} />
              <span>Secure Payment Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © 2025 ARISTINO. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
