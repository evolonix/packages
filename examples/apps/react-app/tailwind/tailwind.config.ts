import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';
import tailwindcssSafeArea from 'tailwindcss-safe-area';
import plugin from 'tailwindcss/plugin';
import { createThemes } from 'tw-colors';
import headings from './base/headings';
import links from './base/links';
import paragraphs from './base/paragraphs';
import colors from './colors';
import buttons from './components/buttons';
import grid from './components/grid';

export const tailwindPreset = {
  theme: {
    colors: {
      current: colors.current,
      inherit: colors.inherit,
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
    },
    extend: {},
  },
  plugins: [
    forms,
    tailwindcssSafeArea,
    createThemes(
      ({ light, dark }) => ({
        light: light({
          primary: colors.cyan,
          secondary: colors.fuchsia,
          neutral: colors.neutral,
          success: colors.green,
          warning: colors.yellow,
          danger: colors.red,
          info: colors.blue,
        }),
        dark: dark({
          primary: colors.violet,
          secondary: colors.teal,
          neutral: colors.neutral,
          success: colors.green,
          warning: colors.yellow,
          danger: colors.red,
          info: colors.blue,
        }),
      }),
      {
        defaultTheme: {
          light: 'light',
          dark: 'dark',
        },
        strict: true,
        produceThemeClass: (themeName) => `theme-${themeName}`,
        produceThemeVariant: (themeName) => `theme-${themeName}`,
      },
    ),
    plugin(({ addBase, addComponents, theme, config }) => {
      const mode = config('darkMode', 'media');
      const darkContext =
        mode === 'media'
          ? '@media (prefers-color-scheme: dark)'
          : `&:where(.dark, .dark *)`;

      addBase(headings(theme));
      addBase(paragraphs(theme, darkContext));
      addBase(links(theme, darkContext));

      addComponents(buttons(theme, darkContext));
      addComponents(grid(theme));
    }),
  ],
} satisfies Omit<Config, 'content'>;
