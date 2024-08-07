import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        webgreen: {
          light: '#BEF264',
          DEFAULT: '#BEF264',
          dark: '#BEF264',
        },
        webgreenHover:{
          light:'#a8f521',
          DEFAULT:'#a8f521',
          dark:'#a8f521'
        },
        var1: {
          light: '#f31260d6',
          DEFAULT: '#f31260',
          dark: '#f70459',
        },
        var2: {
          light: '#BEF264',
          DEFAULT: '#BEF264',
          dark: '#BEF264',
        },
      },
    },
  },
  plugins: [nextui()],
};
export default config;
