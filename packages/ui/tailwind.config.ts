import * as tailwindPreset from '@evolonix/tailwind';
import { join } from 'path';
import { Config } from 'tailwindcss';

export default {
  presets: [tailwindPreset],
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
