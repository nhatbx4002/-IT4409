import { useEffect, useState, useRef } from "react";
import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LuxurySearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TRENDING_SEARCHES = [
  "Áo Sơ Mi",
  "Quần Âu",
  "Nước Hoa",
  "Ví Da",
  "Thắt Lưng",
  "Giày Tây",
];

export function LuxurySearchOverlay({ open, onOpenChange }: LuxurySearchOverlayProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Trigger entrance animation
      setIsVisible(true);
      // Auto-focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 400);
    } else {
      document.body.style.overflow = "";
      setIsVisible(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onOpenChange(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onOpenChange(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-50 bg-[#0a0a0a]
          transition-opacity duration-500 ease-out
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {/* Content Container */}
        <div className="relative h-full w-full flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className={`
              absolute top-8 right-8 z-10
              text-white/40 hover:text-[#D4AF37]
              transition-all duration-300 ease-out
              ${isVisible ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}
            `}
            style={{
              transitionDelay: isVisible ? '600ms' : '0ms',
            }}
          >
            <X className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1} />
          </button>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8">
            {/* Search Icon */}
            <div
              className={`
                text-[#D4AF37] mb-8 transition-all duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
              `}
              style={{
                transitionDelay: isVisible ? '200ms' : '0ms',
              }}
            >
              <Search className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.5} />
            </div>

            {/* Input Container */}
            <div className="w-full max-w-4xl">
              {/* Label */}
              <div
                className={`
                  text-center text-white/60 text-sm sm:text-base mb-6 tracking-widest uppercase
                  transition-all duration-700 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{
                  transitionDelay: isVisible ? '300ms' : '0ms',
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                What are you looking for?
              </div>

              {/* Input */}
              <div
                className={`
                  relative transition-all duration-700 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  transitionDelay: isVisible ? '400ms' : '0ms',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type here..."
                  className={`
                    w-full bg-transparent text-white
                    text-4xl sm:text-5xl lg:text-6xl
                    text-center py-4
                    outline-none
                    placeholder:text-white/20
                    transition-colors duration-300
                  `}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                  }}
                />

                {/* Bottom Border */}
                <div
                  className={`
                    h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent
                    transition-all duration-500 ease-out
                    ${searchQuery || document.activeElement === inputRef.current
                      ? 'opacity-100 scale-x-100'
                      : 'opacity-50 scale-x-75'
                    }
                  `}
                />
              </div>

              {/* Search Button */}
              <div
                className={`
                  mt-12 text-center transition-all duration-700 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{
                  transitionDelay: isVisible ? '500ms' : '0ms',
                }}
              >
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                  className={`
                    px-12 py-4 text-sm tracking-[0.3em] uppercase font-medium
                    border border-white/20 text-white/80
                    hover:border-[#D4AF37] hover:text-[#D4AF37]
                    disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-300
                    ${searchQuery.trim() ? 'hover:tracking-[0.35em]' : ''}
                  `}
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Trending Searches */}
            <div
              className={`
                mt-16 sm:mt-24 text-center transition-all duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{
                transitionDelay: isVisible ? '600ms' : '0ms',
              }}
            >
              <p
                className="text-xs sm:text-sm text-white/40 tracking-[0.2em] uppercase mb-6"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Trending Now
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl">
                {TRENDING_SEARCHES.map((search, index) => (
                  <button
                    key={search}
                    onClick={() => handleSuggestionClick(search)}
                    className={`
                      group relative text-white/60 hover:text-[#D4AF37]
                      text-sm sm:text-base tracking-wide
                      transition-colors duration-300
                    `}
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      transitionDelay: `${650 + index * 50}ms`,
                    }}
                  >
                    {search}
                    <span
                      className={`
                        absolute bottom-0 left-0 w-0 h-px bg-[#D4AF37]
                        group-hover:w-full
                        transition-all duration-300 ease-out
                      `}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div
            className={`
              pb-8 text-center transition-all duration-700 ease-out
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              transitionDelay: isVisible ? '700ms' : '0ms',
            }}
          >
            <p className="text-xs text-white/30" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Press <kbd className="px-2 py-1 bg-white/5 rounded mx-1">Enter</kbd> to search
              <span className="mx-2">•</span>
              Press <kbd className="px-2 py-1 bg-white/5 rounded mx-1">Esc</kbd> to close
            </p>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap');

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }

        /* Remove spinner from number input */
        input[type="text"]::-webkit-search-decoration,
        input[type="text"]::-webkit-search-cancel-button,
        input[type="text"]::-webkit-search-results-button,
        input[type="text"]::-webkit-search-results-decoration {
          display: none;
        }

        /* Smooth cursor blink */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        input:focus {
          animation: none;
        }
      `}</style>
    </>
  );
}
