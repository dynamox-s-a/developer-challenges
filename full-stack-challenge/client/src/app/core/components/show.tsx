import React from "react";

export interface ShowProps {
  when?: boolean;
  fallback?: React.ReactNode;
  children?: React.ReactNode | React.ReactNode[];
}
export const Show: React.FC<ShowProps> = (props) => {
  return <>{props.when ? props.children : props.fallback}</>;
};

export default Show;
