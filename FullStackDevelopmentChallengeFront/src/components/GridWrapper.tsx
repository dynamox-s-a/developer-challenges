import { type ReactNode } from "react";

type GridWrapperProps = {
  children: ReactNode;
  className?: string;
};

export function GridWrapper({ children, className = "" }: GridWrapperProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      {children}
    </div>
  );
}
