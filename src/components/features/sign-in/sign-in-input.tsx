import { cn } from '@/lib/utils';

type SignInInputProps = React.ComponentProps<'input'>;

const SignInInput = ({ className, type, ...props }: SignInInputProps) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'transition-color h-[3.75rem] w-full min-w-0 rounded-lg border border-gray-30 bg-gray-20 p-4 outline-none typography-body1 placeholder:text-gray-40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-[1px] focus-visible:ring-gray-40/50',
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
};

export default SignInInput;
