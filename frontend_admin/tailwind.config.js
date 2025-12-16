/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-black": "#0F0F0F",
        "brand-gold": "#C5A065",
        "brand-gold-hover": "#B08D55",
        "bg-surface": "#F2F2F2",
        "bg-card": "#FFFFFF",
        "border-light": "#E5E5E5",
        "text-primary": "#1A1A1A",
        "text-muted": "#6B7280",
        "text-light": "#F3F4F6",
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        body: ['"Manrope"', "sans-serif"],
        sans: ['"Manrope"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
      },
      boxShadow: {
        card: "0 18px 40px -22px rgba(10, 10, 10, 0.35)",
      },
      borderRadius: {
        sharp: "2px",
      },
      transitionDuration: {
        slow: "500ms",
      },
      letterSpacing: {
        button: "0.08em",
      },
    },
  },
  plugins: [],
};
