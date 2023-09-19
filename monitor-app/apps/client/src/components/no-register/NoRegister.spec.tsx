import { render } from 'test-utils/test-utils'

import NoRegister from './NoRegister'

describe('NoRegister', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NoRegister item="machine" />)
    expect(baseElement).toBeTruthy()
  })
})
