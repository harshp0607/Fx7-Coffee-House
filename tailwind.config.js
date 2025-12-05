/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        tan: "#c4b5a0",
        // Modern pastel holiday colors
        sage: {
          50: "#f0f7f3",
          100: "#ddf0e6",
          200: "#b8e0cd",
          300: "#8dceb0",
          400: "#5eb88e",
          500: "#3a9b6f",
          600: "#2d7a56",
        },
        pine: {
          50: "#eff6f2",
          100: "#d9ebe2",
          200: "#a8d4bd",
          300: "#73ba96",
          400: "#4a9d72",
          500: "#2d7f55",
          600: "#1f5d3e",
        },
        cocoa: {
          50: "#faf8f6",
          100: "#f1ede8",
          200: "#ddd4cb",
          300: "#c4b4a5",
          400: "#a68d78",
          500: "#8a6f5b",
          600: "#6d5647",
        },
        cream: {
          50: "#fdfcfb",
          100: "#f8f6f2",
          200: "#f2ede6",
          300: "#e9e1d7",
          400: "#ddd2c3",
        },
        holiday: {
          red: "#c85a54",
          gold: "#d4af37",
          snow: "#f8fafc",
        },
        // Keep legacy colors for compatibility
        gray: {
          100: "#808080",
          200: "#8b7355",
          300: "#2c2520",
          400: "rgba(0, 0, 0, 0)",
          500: "rgba(255, 255, 255, 0.1)",
          600: "rgba(255, 255, 255, 0.15)",
        },
        dimgray: {
          100: "#7a7169",
          200: "#5a5248",
        },
        whitesmoke: {
          100: "#f9f7f4",
          200: "#f5f3f0",
        },
        gainsboro: "#e8e4df",
        lightgray: "#d9d3cc",
        floralwhite: "#fff8f0",
        antiquewhite: "#f4e8d8",
      },
      spacing: {
        "num-88": "88px",
        "num-22": "22px",
        "num-1": "1px solid #f5f3f0",
        "num-2": "1px solid #2c2520",
        "num-3": "1px solid #d9d3cc",
        "num-4": "2px solid #e8e4df",
      },
      fontFamily: {
        inter: "Inter",
      },
      borderRadius: {
        "num-16": "16px",
        "num-12": "12px",
        "num-10": "10px",
      },
      padding: {
        "num-32": "32px",
        "num-24": "24px",
        "num-20": "20px",
        "num-14": "14px",
        "num-6": "6px",
      },
    },
    fontSize: {
      "num-16": "1rem",
      "num-14": "0.875rem",
      "num-13": "0.813rem",
      "num-20": "1.25rem",
      "num-18": "1.125rem",
      "num-15": "0.938rem",
      "num-12": "0.75rem",
    },
    screens: {
      sm: {
        raw: "screen and (max-width: 420px)",
      },
      md: {
        raw: "screen and (min-width: 421px) and (max-width: 960px)",
      },
      lg: {
        raw: "screen and (min-width: 961px) and (max-width: 1200px)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
