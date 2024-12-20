"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { NoSsr } from "@/components/core/no-ssr";
import Image from "next/image";

// Default dimensions for the logo
const DEFAULT_HEIGHT = 190;
const DEFAULT_WIDTH = 40;

/**
 * Logo component that displays an image of the logo with customizable height and width.
 * @param {Object} props - The properties for the Logo component.
 * @param {number} [props.height=DEFAULT_HEIGHT] - The height of the logo.
 * @param {number} [props.width=DEFAULT_WIDTH] - The width of the logo.
 * @returns {React.JSX.Element} - The rendered Logo component.
 */
export function Logo({
  height = DEFAULT_HEIGHT,
  width = DEFAULT_WIDTH,
}: LogoProps): React.JSX.Element {
  return (
    <Image
      alt="logo"
      src="/assets/logo-dynapredict.png"
      height={height}
      width={width}
    />
  );
}

interface LogoProps {
  height?: number;
  width?: number;
}

/**
 * DynamicLogo component that uses `NoSsr` to render the Logo only on the client-side.
 * @param {Object} props - The properties for the DynamicLogo component.
 * @param {number} [props.height=DEFAULT_HEIGHT] - The height of the logo.
 * @param {number} [props.width=DEFAULT_WIDTH] - The width of the logo.
 * @returns {React.JSX.Element} - The rendered DynamicLogo component with SSR fallback.
 */
export function DynamicLogo({
  height = DEFAULT_HEIGHT,
  width = DEFAULT_WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  return (
    <NoSsr
      fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}
    >
      <Logo height={height} width={width} {...props} />
    </NoSsr>
  );
}

interface DynamicLogoProps {
  height?: number;
  width?: number;
}
