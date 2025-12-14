import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#050509]">
      {/* Background Imagery */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 right-0 w-full md:w-1/2 bg-linear-to-l from-black via-black/40 to-transparent">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1300&q=80"
            alt="Tailored menswear on model"
            className="h-full w-full object-cover"
          />
          {/* Glass gradient over image */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-l from-black via-black/40 to-transparent" />
        </div>
        {/* Subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.85),rgba(0,0,0,1))]" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center px-6 py-16 sm:px-8 lg:px-0">
        <div className="max-w-xl space-y-7">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-[#E5E7EB] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            <span>Autumn Atelier · 2025</span>
          </div>

          <h1 className="font-['Playfair_Display'] text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Tailored Luxury
            <br />
            for the Modern Gentleman
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-slate-200 sm:text-base">
            Discover Italian wool suits, hand-finished shirting and leather
            essentials curated for evenings, boardrooms and every moment in
            between.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              className="h-12 rounded-full bg-[#D4AF37] px-8 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5 hover:bg-[#B6911F]"
            >
              Shop New Season
            </Button>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:text-white"
            >
              Explore Evening Edit
              <span className="h-px w-10 bg-slate-500" />
            </button>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 text-xs text-slate-300">
            <div className="space-y-1">
              <p className="font-semibold tracking-[0.2em] text-slate-400">
                SUITS
              </p>
              <p>Italian wool · Half canvassed · Hand finished</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold tracking-[0.2em] text-slate-400">
                EXPRESS
              </p>
              <p>Complimentary tailoring & worldwide delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-slate-300">
        <span className="tracking-[0.3em] uppercase">Scroll</span>
        <div className="flex h-10 w-px items-start justify-center overflow-hidden bg-slate-600/60">
          <div className="h-10 w-px animate-[scrollLine_1.6s_ease-in-out_infinite] bg-[#D4AF37]" />
        </div>
      </div>
    </section>
  );
}

// Tailwind keyframes (add to tailwind config if not already present):
// keyframes: { scrollLine: { '0%, 100%': { transform: 'translateY(-100%)' }, '50%': { transform: 'translateY(0%)' } } }
