import { UserContextProvider } from './context'
import { UserCard } from './UserCard'

export const User = () => {
  return (
    <UserContextProvider>
      <UserCard />
    </UserContextProvider>
  )
}
