import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      josefin: ["Josefin Sans", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
