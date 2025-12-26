import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image: "https://cdn.hstatic.net/files/200000886795/file/web_pc.png", 
    link: "/collections/hon-dan-toc-dau-di-san-collection",
    alt: "Fall Winter Collection"
  },
  {
    id: 2,
    image: "https://cdn.hstatic.net/files/200000886795/file/homepage.jpg",
    link: "/collections/vest-nam",
    alt: "Gentleman Suits"
  },
  {
    id: 3,
    image: "https://cdn.hstatic.net/files/200000887901/file/web_-_pc_a6763ca994c04159a3732bf7bd4303bd.jpg",
    link: "/collections/phu-kien",
    alt: "Accessories"
  }
];

const AUTOPLAY_DELAY = 5000;

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
      }, AUTOPLAY_DELAY);
    }
    return () => resetTimeout();
  }, [current, isPaused]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  return (
    <section 
      className="relative w-full overflow-hidden bg-black"
      style={{ height: '85vh', minHeight: '600px' }} 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* --- SLIDES --- */}
      {SLIDES.map((slide, index) => (
        <a
          key={slide.id}
          href={slide.link}
          className={`absolute inset-0 block h-full w-full transition-opacity duration-[1000ms] ${
            index === current ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className={`h-full w-full object-cover object-top transition-transform duration-[10000ms] ease-linear ${
              index === current ? "scale-110" : "scale-100"
            }`}
          />
          {/* Lớp phủ nhẹ giúp nút bấm rõ hơn */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </a>
      ))}

      {/* --- SIMPLE BUTTONS (Luôn hiển thị hoặc hover nhẹ) --- */}
      {/* Nút Trái */}
      <button 
        onClick={(e) => { e.preventDefault(); prevSlide(); }}
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white transition-colors hover:bg-black/50"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Nút Phải */}
      <button 
        onClick={(e) => { e.preventDefault(); nextSlide(); }}
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white transition-colors hover:bg-black/50"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* --- PROGRESS LINE (Giữ lại để biết thời gian slide chạy) --- */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {SLIDES.map((_, index) => (
          <div
            key={index}
            className={`h-[2px] w-12 transition-colors duration-300 ${index === current ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </div>

    </section>
  );
}