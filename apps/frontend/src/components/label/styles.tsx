'use client';

import type { LabelVariant } from './types';

import { varAlpha } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { colorKeys } from 'src/theme/core';

// ----------------------------------------------------------------------

const baseColors = ['default'] as const;
const allColors = [...baseColors, ...colorKeys.palette, ...colorKeys.common] as const;

export const LabelRoot = styled('span', {
  shouldForwardProp: (prop: string) => !['color', 'variant', 'disabled', 'sx'].includes(prop),
})<{ variant?: LabelVariant; disabled?: boolean }>(({ theme }) => ({
  height: 24,
  minWidth: 24,
  flexShrink: 0,
  lineHeight: 18 / 12,
  cursor: 'default',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  gap: theme.spacing(0.75),
  justifyContent: 'center',
  padding: theme.spacing(0, 0.75),
  fontSize: theme.typography.pxToRem(12),
  fontWeight: theme.typography.fontWeightBold,
  borderRadius: Number(theme.shape.borderRadius) * 0.75,
  variants: [
    /**
     * @variant filled
     */
    {
      props: { variant: 'filled', color: 'default' },
      style: {
        ...theme.mixins.filledStyles(theme, 'inherit'),
      },
    },
    ...colorKeys.common.map((colorKey) => ({
      props: { variant: 'filled', color: colorKey },
      style: {
        ...theme.mixins.filledStyles(theme, colorKey),
      },
    })),
    ...colorKeys.palette.map((colorKey) => ({
      props: { variant: 'filled', color: colorKey },
      style: {
        ...theme.mixins.filledStyles(theme, colorKey),
      },
    })),
    /**
     * @variant outlined
     */
    {
      props: { variant: 'outlined' },
      style: {
        border: '2px solid currentColor',
      },
    },
    ...colorKeys.common.map((colorKey) => ({
      props: { variant: 'outlined', color: colorKey },
      style: {
        color: theme.vars.palette.common[colorKey],
      },
    })),
    ...colorKeys.palette.map((colorKey) => ({
      props: { variant: 'outlined', color: colorKey },
      style: {
        color: theme.vars.palette[colorKey].main,
      },
    })),
    /**
     * @variant soft
     */
    ...allColors.map((colorKey) => ({
      props: { variant: 'soft', color: colorKey },
      style: () => {
        const currentColor = colorKey === 'default' ? 'inherit' : colorKey;

        return {
          ...theme.mixins.softStyles(theme, currentColor),
        };
      },
    })),
    /**
     * @variant inverted
     */
    {
      props: { variant: 'inverted', color: 'default' },
      style: {
        color: theme.vars.palette.grey[800],
        backgroundColor: theme.vars.palette.grey[300],
      },
    },
    ...colorKeys.common.map((colorKey) => ({
      props: { variant: 'inverted', color: colorKey },
      style: {
        color: theme.vars.palette.common[colorKey],
        backgroundColor: varAlpha('currentColor', theme.vars.opacity.soft.commonHoverBg),
      },
    })),
    ...colorKeys.palette.map((colorKey) => ({
      props: { variant: 'inverted', color: colorKey },
      style: {
        color: theme.vars.palette[colorKey].darker,
        backgroundColor: theme.vars.palette[colorKey].lighter,
        ...theme.applyStyles('dark', {
          color: theme.vars.palette[colorKey].lighter,
          backgroundColor: theme.vars.palette[colorKey].darker,
        }),
      },
    })),
    /**
     * @disabled
     */
    {
      props: { disabled: true },
      style: {
        opacity: 0.48,
        pointerEvents: 'none',
      },
    },
  ],
}));

export const LabelIcon = styled('span')({
  width: 16,
  height: 16,
  flexShrink: 0,
  '& svg, & img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});
