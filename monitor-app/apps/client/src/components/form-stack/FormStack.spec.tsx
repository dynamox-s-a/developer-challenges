import { render } from '@testing-library/react'

import FormStack from './FormStack'

describe('FormStack', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormStack />)
    expect(baseElement).toBeTruthy()
  })
})
