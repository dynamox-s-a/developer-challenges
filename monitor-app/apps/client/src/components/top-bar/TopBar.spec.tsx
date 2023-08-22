import { render, screen } from '../../test-utils/test-utils'

import TopBar from './TopBar'

const handleDrawerToggle = jest.fn()

jest.mock('next-auth/react', () => {
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { name: 'teste', email: 'email@example.com' }
  }
  return {
    useSession: jest.fn(() => {
      return { data: mockSession, status: 'authenticated' }
    })
  }
})

describe('TopBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TopBar isLgUp={true} handleDrawerToggle={handleDrawerToggle} />)
    expect(baseElement).toBeTruthy()
    const appHeading = screen.queryByText('monitor-app')
    expect(appHeading).not.toBeInTheDocument()
  })

  it('should render with title when layout breakpoint is less than lg', async () => {
    const { baseElement } = render(
      <TopBar isLgUp={false} handleDrawerToggle={handleDrawerToggle} />
    )
    expect(baseElement).toBeTruthy()
    const appHeading = screen.queryByText('monitor-app')
    expect(appHeading).toBeInTheDocument()
  })
})
