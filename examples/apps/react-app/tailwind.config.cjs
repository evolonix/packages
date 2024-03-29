const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // prettier-ignore
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addBase, addComponents, theme }) => {
      addBase({
        ':any-link': {
          color: theme('colors.blue.600'),

          '&:hover': { color: theme('colors.blue.700') },
        },

        h1: {
          fontSize: theme('fontSize.2xl'),
          lineHeight: theme('lineHeight.9'),
          fontWeight: theme('fontWeight.bold'),
        },
      });

      addComponents({
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          backgroundColor: theme('colors.blue.500'),
          color: theme('colors.white'),

          '&:hover': { backgroundColor: theme('colors.blue.600') },
        },

        '.btn-link': {
          padding: '0',
          color: theme('colors.blue.600'),

          '&:hover': { color: theme('colors.blue.700') },
        },
      });
    }),
  ],
};
