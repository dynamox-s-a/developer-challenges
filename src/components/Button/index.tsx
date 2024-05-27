import { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  children: string;
  className?: string;
}

function Button({ children, className, ...props }: ButtonProps) {
  return (
    <>
      <button {...props} className={className}>
        {children}
      </button>
    </>
  );
}

export default Button;
