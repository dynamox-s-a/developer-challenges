import React from "react";
import styles from "./buttonLink.module.css";

interface ButtonLinkProps {
  children: React.ReactNode;
  href?: string;
  variante?: "footer" | "card";
}

export const ButtonLink = ({
  children,
  href = "#",
  variante = "footer",
}: ButtonLinkProps) => {
  const classes = `${styles.buttonLink} ${styles[variante]}`;
  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
};
