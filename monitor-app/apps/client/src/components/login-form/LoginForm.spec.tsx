import { render, screen } from '../../test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { signIn as mockSignIn } from 'next-auth/react'
import LoginForm from './LoginForm'

jest.mock('next-auth/react')
const signIn = mockSignIn as jest.Mock

describe('LoginForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoginForm />)
    expect(baseElement).toBeTruthy()
  })

  it('should render a disabled enter button when fields are blank', () => {
    render(<LoginForm />)
    const enterButton = screen.getByText('Enter')
    expect(enterButton).toBeInTheDocument()
    expect(enterButton).toBeDisabled()
  })

  it('should render enter a enabled button when email field is not blank', async () => {
    render(<LoginForm />)
    const emailInput = screen.getByLabelText('E-mail')
    const enterButton = screen.getByText('Enter')
    const user = userEvent.setup()
    await user.type(emailInput, 'test@email.com')
    expect(enterButton).toBeInTheDocument()
    expect(enterButton).toBeEnabled()
  })

  it('should render a email validation error message when provided email format is invalid', async () => {
    render(<LoginForm />)
    const emailInput = screen.getByLabelText('E-mail')
    const enterButton = screen.getByText('Enter')
    const user = userEvent.setup()
    await user.type(emailInput, 'email')
    await user.click(enterButton)
    expect(await screen.findByText('Entered value does not match email format')).toBeInTheDocument()
  })

  it('should render a password validation error message when provided password is blank', async () => {
    render(<LoginForm />)
    const user = userEvent.setup()
    const emailInput = screen.getByLabelText('E-mail')
    const enterButton = screen.getByText('Enter')
    await user.type(emailInput, 'test@email.com')
    await user.click(enterButton)
    expect(await screen.findByText('Password is required')).toBeInTheDocument()
  })

  it('should render hidden password when visibility icon is ON', async () => {
    render(<LoginForm />)
    const user = userEvent.setup()
    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, '12345')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should render visible password when visibility icon is OFF', async () => {
    render(<LoginForm />)
    const user = userEvent.setup()
    const passwordInput = screen.getByLabelText('Password')
    const visibilityIconButton = screen.getByLabelText('toggle password visibility')
    await user.type(passwordInput, '12345')
    await user.click(visibilityIconButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('should render the error notification when login fails', async () => {
    signIn.mockResolvedValueOnce({ error: 'Authentication failed' })
    render(<LoginForm />)
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Password')
    const enterButton = screen.getByText('Enter')
    const user = userEvent.setup()
    await user.type(emailInput, 'test@email.com')
    await user.type(passwordInput, '12345')
    await user.click(enterButton)
    expect(await screen.findByText('Authentication failed')).toBeInTheDocument()
  })

  it('should submit the form when provided credentials are valid', async () => {
    signIn.mockResolvedValueOnce({})
    render(<LoginForm />)
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Password')
    const enterButton = screen.getByText('Enter')
    const user = userEvent.setup()
    await user.type(emailInput, 'test@email.com')
    await user.type(passwordInput, '12345')
    await user.click(enterButton)
    expect(signIn).toHaveBeenCalledWith('credentials', {
      callbackUrl: '/dashboard',
      redirect: false,
      email: 'test@email.com',
      userPassword: '12345'
    })
  })
})
