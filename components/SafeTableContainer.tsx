"use client"

import type React from "react"

import { forwardRef } from "react"
import { Paper, Table, Typography } from "@mui/material"

interface SafeTableContainerProps {
  children: React.ReactNode
  isEmpty?: boolean
  emptyMessage?: string
}

export const SafeTableContainer = forwardRef<HTMLDivElement, SafeTableContainerProps>(
  ({ children, isEmpty = false, emptyMessage = "Nenhum dado encontrado" }, ref) => {
    if (isEmpty) {
      return (
        <Paper ref={ref} sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {emptyMessage}
          </Typography>
        </Paper>
      )
    }

    return (
      <Paper ref={ref}>
        <Table>{children}</Table>
      </Paper>
    )
  },
)

SafeTableContainer.displayName = "SafeTableContainer"
