import type { Preview } from '@storybook/nextjs';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'luxe-dark',
      values: [
        { name: 'luxe-dark', value: '#0a0a0c' },
        { name: 'luxe-light', value: '#f5f0e8' },
      ],
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
