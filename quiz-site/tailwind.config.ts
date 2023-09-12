import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        leftToRight: {
          "0%": { backgroundPosition: "left" },
          "100%": { backgroundPosition: "right" },
        },
        gradientSlide: {
          "0%": {
            borderImageSlice: "1",
            borderImageSource: "linear-gradient(0deg,red,blue)",
            color: "red",
          },
          "100%": {
            borderImageSlice: "1",
            borderImageSource: "linear-gradient(360deg,red,blue)",
            color: "blue",
          },
        },
      },
      animation: {
        leftToRight: "leftToRight 3s infinite alternate",
        gradientSlide: "gradientSlide 3s infinite ",
      },
    },
  },
  plugins: [],
} satisfies Config;
