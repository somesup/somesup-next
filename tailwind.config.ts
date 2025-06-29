import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#171717',
        gray: {
          '10': '#171717',
          '20': '#3d3d3d',
          '30': '#5d5d5d',
          '40': '#888888',
          '50': '#fafafa',
        },
        error: '#FF7A7C',
        semantic: '#FF3F62',
      },
    },
  },
  plugins: [],
};
export default config;
