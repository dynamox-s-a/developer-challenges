import { render, screen } from 'test-utils/test-utils'
import { useRouter } from 'next/navigation'

import PagesHeader from './PagesHeader'
import userEvent from '@testing-library/user-event'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ back: jest.fn() })
}))

describe('PagesHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PagesHeader title="title" />)
    expect(baseElement).toBeTruthy()
  })
  it('should back when clicks back icon', async () => {
    const router = useRouter()
    render(<PagesHeader title="title" />)
    const backButton = screen.getByLabelText('back')
    const user = userEvent.setup()
    await user.click(backButton)
    expect(router.back).toHaveBeenCalled()
  })
})
