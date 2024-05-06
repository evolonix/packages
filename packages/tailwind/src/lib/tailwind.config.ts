import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';
import tailwindcssSafeArea from 'tailwindcss-safe-area';
import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';
import { createThemes } from 'tw-colors';
import headings from '../base/headings';
import links from '../base/links';
import paragraphs from '../base/paragraphs';
import buttons from '../components/buttons';
import grid from '../components/grid';
import reset from '../components/reset';

export default {
  theme: {
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
          info: colors.blue,
          success: colors.green,
          warning: colors.yellow,
          danger: colors.red,
        }),
        dark: dark({
          primary: colors.violet,
          secondary: colors.teal,
          neutral: colors.neutral,
          info: colors.blue,
          success: colors.green,
          warning: colors.yellow,
          danger: colors.red,
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
      addBase(links(theme, darkContext));
      addBase(paragraphs(theme, darkContext));

      addComponents(buttons(theme, darkContext));
      addComponents(grid(theme));
      addComponents(reset(theme));
    }),
  ],
} satisfies Omit<Config, 'content'>;
