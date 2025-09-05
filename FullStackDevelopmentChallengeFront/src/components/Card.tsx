import { type ReactNode } from "react";
import tw from "tailwind-styled-components";

// wrappers

const CardWrapper = tw.div`
  w-full max-w-md p-6 bg-white rounded-xl shadow-lg m-2
`;

const CardHeader = tw.div`
  mb-4
`;

const CardTitle = tw.h2`
  text-xl font-semibold text-gray-700
`;

const CardBody = tw.div`
  space-y-2
`;

const CardFooter = tw.div`
  mt-4 pt-2 border-t border-gray-200 text-sm text-gray-500
`;

// props
type CardProps = {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
};

// componente
export function Card({
  title,
  children,
  footer,
  onClick,
  className,
}: CardProps) {
  return (
    <CardWrapper onClick={onClick} className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardBody>{children}</CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardWrapper>
  );
}
