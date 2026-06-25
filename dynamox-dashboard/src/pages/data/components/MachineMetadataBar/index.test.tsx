import { ThemeProvider } from '@mui/material'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { theme } from '../../../../theme'
import { MachineMetadataBar } from '.'

function TestIcon() {
  return <svg aria-hidden="true" />
}

describe('MachineMetadataBar', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders all metadata labels', () => {
    render(
      <ThemeProvider theme={theme}>
        <MachineMetadataBar
          items={[
            { icon: TestIcon, label: 'Máquina 1023' },
            { icon: TestIcon, label: 'Ponto 20192' },
            { icon: TestIcon, label: '200' },
          ]}
        />
      </ThemeProvider>,
    )

    expect(screen.getByText('Máquina 1023')).toBeTruthy()
    expect(screen.getByText('Ponto 20192')).toBeTruthy()
    expect(screen.getByText('200')).toBeTruthy()
  })
})
