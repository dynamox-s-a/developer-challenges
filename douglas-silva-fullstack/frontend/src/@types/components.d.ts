declare module "@components/*" {
  import type { ComponentType, PropsWithChildren } from "react";

  interface DefaultComponentProps extends PropsWithChildren {
    [key: string]: unknown;
  }

  const component: ComponentType<DefaultComponentProps>;
  export default component;
}
