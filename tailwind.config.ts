import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px", // yan reklam rayları yalnızca bu genişlikten itibaren
    },
    extend: {
      colors: {
        // ── Sıcak topraksı (organik) açık tema ──────────────────────────
        // İnsan-tasarımı, dergi gibi hisset; neon-cyberpunk değil.
        base: "#f3ead9",     // sıcak krem — sayfa arka planı
        surface: "#faf5ec",  // header/sidebar/yükseltilmiş yüzeyler
        card: "#fffdf8",     // kart arka planı (neredeyse beyaz, sıcak)
        line: "#e6dcc6",     // sıcak kenarlık
        ink: "#2f2820",      // koyu başlık/önemli metin

        // Vurgu renkleri — eski "neon" anahtarları korunur (kod kırılmasın),
        // ama değerler doğal tonlara çevrildi.
        neon: {
          DEFAULT: "#2f6b43", // orman yeşili (birincil vurgu, eski cyan)
          purple: "#b5683a",  // terrakota (eski mor)
          pink: "#c2575b",    // sıcak gül (favoriler ♥, eski pembe)
          lime: "#c2882b",    // kehribar/oker (eski lime)
        },

        // Slate ölçeğini "ters çevir": kod düşük numaraları (100-300) önemli
        // metin, yüksek numaraları (400-600) soluk metin için kullanıyor.
        // Açık temada önemli = koyu, soluk = orta-sıcak gri olsun.
        slate: {
          50: "#2b241c",
          100: "#2f2820",
          200: "#3a3327",
          300: "#4f4636",
          400: "#7c6e57",
          500: "#8f8067",
          600: "#a4957a",
          700: "#c2b6a0",
          800: "#ddd2bd",
          900: "#ece3d2",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Yumuşak, doğal gölge (neon glow yerine)
        glow: "0 1px 2px rgba(60,46,26,.06), 0 8px 24px -10px rgba(60,46,26,.18)",
        "glow-purple": "0 1px 2px rgba(60,46,26,.06), 0 10px 28px -10px rgba(181,104,58,.28)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 50% 0%, rgba(47,107,67,.08), transparent 60%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
