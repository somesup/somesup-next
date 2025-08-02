import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex px-2 py-1 items-center typography-body1 justify-center whitespace-nowrap rounded-[0.625rem] transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default: 'bg-gray-60 text-gray-10 hover:bg-gray-60/80 active:bg-gray-60/40',
        secondary: 'bg-gray-20 text-gray-60 hover:bg-gray-20/80 active:bg-gray-20/40',
        ghost: 'active:bg-gray-60/20',
      },
      size: {
        default: 'h-[3.75rem] w-full',
        fit: 'h-fit w-fit',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return <button data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};

export { Button, buttonVariants };
