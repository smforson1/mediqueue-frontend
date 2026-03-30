export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6", // Blue
          dark: "#2563eb",
        },
        secondary: {
          orange: "#f97316", // Orange
          red: "#ef4444", // Red
          green: "#22c55e", // Green
        },
        medical: {
          grey: "#f3f4f6", // Light grey (cards)
          blue: "#eff6ff", // Light blue (section separation)
        },
        lightTheme: "#fefeff",
        darkTheme: "#131826",
        buttonBlue: "#0052CC",
        textBlue: "#344EC5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        medical: "0.75rem",
      },
      boxShadow: {
        medical:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
