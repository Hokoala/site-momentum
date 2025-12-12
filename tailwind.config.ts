import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            interference: ['KHInterference', 'sans-serif'],
        },
        keyframes: {
            slideDown: {
                '0%': {
                    opacity: '0',
                    transform: 'translateY(-30px)'
                },
                '100%': {
                    opacity: '1',
                    transform: 'translateY(0)'
                },
            },
        },
        animation: {
            slideDown: 'slideDown 0.6s ease-out forwards',
        },
    },
  },
};

export default config;