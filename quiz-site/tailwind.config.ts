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
        fadeIn1: {
          "0%": { opacity: "0" },
          "29%": { opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { opacity: "1" },
        },
        fadeIn2: {
          "0%": { opacity: "0" },
          "44%": { opacity: "0" },
          "45%": { opacity: "1" },
          "100%": { opacity: "1" },
        },
        fadeIn3: {
          "0%": { opacity: "0" },
          "59%": { opacity: "0" },
          "60%": { opacity: "1" },
          "100%": { opacity: "1" },
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
        width10to100: {
          "0%": { width: "10%" },
          "100%": { width: "100%" },
        },
        width0to90: {
          "0%": { width: "0%" },
          "100%": { width: "90%" },
        },
        fishJump: {
          "0%": { transform: "translateY(0px)" },
          "10%": { transform: "translateY(-20px) rotate(0.03turn)" },
          "20%": { transform: "translateY(0px) rotate(-0.03turn)" },
          "30%": { transform: "translateY(-20px) rotate(0.03turn)" },
          "40%": { transform: "translateY(0px) rotate(-0.03turn)" },
          "50%": { transform: "translateY(-20px) rotate(0.03turn)" },
          "60%": { transform: "translateY(0px) rotate(-0.03turn)" },
          "70%": { transform: "translateY(-10px) rotate(0.02turn)" },
          "80%": { transform: "translateY(0px) rotate(-0.02turn)" },
          "90%": { transform: "translateY(-5px) rotate(0.003turn)" },
          "100%": { transform: "translateY(0px) rotate(0turn)" },
        },
      },
      animation: {
        leftToRight: "leftToRight 3s infinite alternate",
        gradientSlide: "gradientSlide 3s infinite ",
        fadeIn1: "fadeIn1 4s infinite ",
        fadeIn2: "fadeIn2 4s infinite ",
        fadeIn3: "fadeIn3 4s infinite ",
        width0to90: "width0to90 5s ",
        width10to100: "width10to100 5s ",
        fishJump: "fishJump 5s ",
      },
    },
  },
  plugins: [],
} satisfies Config;
