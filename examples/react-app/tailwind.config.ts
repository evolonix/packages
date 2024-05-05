import * as tailwindPreset from '@evolonix/tailwind';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import { join } from 'path';
import { Config } from 'tailwindcss';

export default {
  presets: [tailwindPreset],
  content: [
    join(__dirname, 'index.html'),
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
