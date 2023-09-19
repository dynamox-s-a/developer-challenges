import { render } from '@testing-library/react'

import { AlertWrapper } from './AlertWrapper'

describe('AlertWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AlertWrapper />)
    expect(baseElement).toBeTruthy()
  })
})
