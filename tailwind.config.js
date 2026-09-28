/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBFAF5",
        "cream-dim": "#F4F0E6",
        ink: "#16221C",
        "ink-soft": "#48594F",
        emerald: {
          DEFAULT: "#0E5A43",
          deep: "#0A3E2E",
          mid: "#146B52",
          light: "#E4EFE8",
          soft: "#CFE3D6",
        },
        gold: {
          DEFAULT: "#B8912E",
          deep: "#8F6F1F",
          light: "#F3E6BE",
          soft: "#FBF3DC",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(10, 62, 46, 0.18)",
        cardHover: "0 20px 45px -15px rgba(10, 62, 46, 0.28)",
        gold: "0 8px 24px -8px rgba(184, 145, 46, 0.35)",
      },
      backgroundImage: {
        "leaf-veil": "radial-gradient(circle at 85% 10%, rgba(184,145,46,0.10), transparent 45%), radial-gradient(circle at 5% 90%, rgba(14,90,67,0.10), transparent 45%)",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "500" },
          "100%": { strokeDashoffset: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        floatSlow: "floatSlow 6s ease-in-out infinite",
        drawLine: "drawLine 2.4s ease-out forwards",
        fadeUp: "fadeUp 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};
