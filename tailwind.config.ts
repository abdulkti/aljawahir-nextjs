import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
        serif: ['Lora', 'serif'],
        arabic: ['Amiri', 'serif'],
      },
      colors: {
        green: {
          950: '#022c22',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
