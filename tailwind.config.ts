import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        mobile: '480px',
      },
      height: {
        screen: '100dvh',
      },
      maxHeight: {
        screen: '100dvh',
      },
      colors: {
        background: '#171717',
        gray: {
          '10': '#171717',
          '20': '#3d3d3d',
          '30': '#5d5d5d',
          '40': '#888888',
          '50': '#c4c4c4',
          '60': '#fafafa',
        },
        error: '#FF7A7C',
        semantic: '#FF3F62',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        /* 대제목 - Black 28pt / Line height : 22 */
        '.typography-main-title': {
          'font-size': '1.75rem' /* 28px */,
          'line-height': '2rem' /* 32px */,
          'font-weight': '900',
          'letter-spacing': '-0.5px',
        },
        /* 중제목 - Regular 20pt / Line height : 31px */
        '.typography-sub-title': {
          'font-size': '1.25rem' /* 20px */,
          'line-height': '2rem' /* 32px */,
          'font-weight': '400',
          'letter-spacing': '-0.5px',
        },
        /* 중제목 - Bold 20pt / Line height : 31px */
        '.typography-sub-title-bold': {
          'font-size': '1.25rem' /* 20px */,
          'line-height': '2rem' /* 32px */,
          'font-weight': '700',
          'letter-spacing': '-0.5px',
        },
        /* 소제목 - Medium 18pt / Line height : 29px */
        '.typography-small-title': {
          'font-size': '1.125rem' /* 18px */,
          'line-height': '1.8125rem' /* 29px */,
          'font-weight': '500',
          'letter-spacing': '-0.5px',
        },
        /* 버튼텍스트, 뉴스상세보기 - Medium 16pt / Line height : 32px */
        '.typography-body1': {
          'font-size': '1rem' /* 16px */,
          'line-height': '2rem' /* 32px */,
          'font-weight': '500',
          'letter-spacing': '-0.5px',
        },
        /* 뉴스요약보기, 알림창context - Regular 14pt / Line height : 28px */
        '.typography-body2': {
          'font-size': '0.875rem' /* 14px */,
          'line-height': '1.75rem' /* 28px */,
          'font-weight': '400',
          'letter-spacing': '-0.5px',
        },
        '.typography-body3': {
          'font-size': '0.875rem' /* 14px */,
          'line-height': '1.375rem' /* 22px */,
          'font-weight': '500',
          'letter-spacing': '-0.5px',
        },
        /* 주석, 경고문구 - Regular 12pt / Line height : 29px */
        '.typography-caption': {
          'font-size': '0.75rem' /* 12px */,
          'line-height': '1.813rem' /* 29px */,
          'font-weight': '400',
          'letter-spacing': '-0.5px',
        },
        /* toast description */
        '.typography-caption2': {
          'font-size': '0.75rem' /* 12px */,
          'line-height': '1.25rem' /* 20px */,
          'font-weight': '400',
          'letter-spacing': '-0.5px',
        },
        /* 원본 기사 보기 */
        '.typography-caption3': {
          'font-size': '0.625rem' /* 10px */,
          'line-height': '1.813rem' /* 29px */,
          'font-weight': '400',
          'letter-spacing': '-0.5px',
        },
      });
    }),
    require('@tailwindcss/typography'),
  ],
};
export default config;
