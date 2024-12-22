import { LoginContextProvider } from './context'
import { LoginCard } from './LoginCard'

export const Login = () => {
  return (
    <LoginContextProvider>
      <LoginCard />
    </LoginContextProvider>
  )
}
