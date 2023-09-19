import { render } from '@testing-library/react'

import { ActionsWrapper } from './ActionsWrapper'

describe('ActionsWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ActionsWrapper />)
    expect(baseElement).toBeTruthy()
  })
})
