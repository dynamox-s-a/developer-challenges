import { type ReactNode } from "react";

type PageTitleProps = {
  children: ReactNode;
  className?: string;
};

export function PageTitle({ children, className = "" }: PageTitleProps) {
  return (
    <h1
      className={`text-3xl font-bold text-gray-800 mb-6 text-center ${className}`}
    >
      {children}
    </h1>
  );
}
