import { PluginUtils } from 'tailwindcss/types/config';

export default (theme: PluginUtils['theme'], darkContext: string) => ({
  ':any-link': {
    color: theme('colors.primary-600'),

    '&:hover': { color: theme('colors.primary-500') },

    [darkContext]: {
      color: theme('colors.primary-500'),

      '&:hover': { color: theme('colors.primary-400') },
    },
  },
});
