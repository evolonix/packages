import { CSSRuleObject, PluginUtils } from 'tailwindcss/types/config';

export default (theme: PluginUtils['theme'], darkContext: string) =>
  ({
    'a, :any-link': {
      color: theme('colors.primary-600'),

      '&:hover': {
        color: theme('colors.primary-500'),
      },

      '&:focus': {
        outlineStyle: 'none',
        color: theme('colors.primary-500'),
      },

      [darkContext]: {
        color: theme('colors.primary-500'),

        '&:hover': {
          color: theme('colors.primary-400'),
        },

        '&:focus': {
          color: theme('colors.primary-400'),
        },
      },
    },
  }) satisfies CSSRuleObject;
