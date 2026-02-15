import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Explorar coleccion',
    variant: 'gold',
    size: 'lg',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const GoldCta: Story = {};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Ver categorias',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Procesando',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'sage',
    rightIcon: <ArrowRight className="h-4 w-4" />,
    children: 'Ir a productos',
  },
};
