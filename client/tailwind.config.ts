import { PiImageBrokenLight } from "react-icons/pi";
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
          light: "#BEF264",
          DEFAULT: "#BEF264",
          dark: "#BEF264",
        },
        webgreenHover: {
          light: "#a8f521",
          DEFAULT: "#a8f521",
          dark: "#a8f521",
        },
        var1: {
          light: "#f31260d6",
          DEFAULT: "#f31260",
          dark: "#f70459",
        },
        var2: {
          light: "#BEF264",
          DEFAULT: "#BEF264",
          dark: "#BEF264",
        },
        webred: {
          light: "#FFECEC",
          DEFAULT: "#FE423F",
          dark: "#FE423F",
        },
        pageBg: {
          light: "#f5f5f5",
          DEFAULT: "#f5f5f5",
          dark: "#f5f5f5",
        },
      },
      boxShadow: {
        'custom': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [nextui()],
};
export default config;
