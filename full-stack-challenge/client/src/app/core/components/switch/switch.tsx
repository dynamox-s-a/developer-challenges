import React, { ReactNode } from 'react';
import { MatchProps } from './match';

export interface SwitchProps {
  fallback?: React.ReactNode | React.ReactNodeArray;
  children?: ReactNode;
}
export const Switch: React.FC<SwitchProps> = (props) => {
  // @ts-expect-error: Unreachable code error
  const hasActiveChildren = !!React.Children.map(
    props.children,
    (child) => child as React.ReactElement<React.PropsWithChildren<MatchProps>>
  ).filter((child) => !!child?.props.when).length;
  return <>{hasActiveChildren ? props.children : props.fallback}</>;
};

export default Switch;
