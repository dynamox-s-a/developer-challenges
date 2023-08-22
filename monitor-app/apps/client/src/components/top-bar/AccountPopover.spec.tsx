import { render, screen } from '../../test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { signOut as mockSignOut } from 'next-auth/react'
import AccountPopover from './AccountPopover'

const signOut = mockSignOut as jest.Mock

jest.mock('next-auth/react', () => {
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { name: 'teste', email: 'email@example.com' }
  }
  return {
    useSession: jest.fn(() => {
      return { data: mockSession, status: 'authenticated' }
    }),
    signOut: jest.fn(() => {
      return { redirect: false, callbackUrl: '/' }
    })
  }
})

describe('AccountPopover', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AccountPopover />)
    expect(baseElement).toBeTruthy()
  })
  it('should signOut when click Sign Out', async () => {
    render(<AccountPopover />)
    const accountMenuButton = screen.getByRole('button')
    const user = userEvent.setup()
    await user.click(accountMenuButton)
    const signOutButton = screen.getByRole('menuitem')
    await user.click(signOutButton)
    expect(signOut).toHaveBeenCalledWith({ redirect: false, callbackUrl: '/' })
  })
})
