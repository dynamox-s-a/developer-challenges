import { HomeContextProvider } from './context'
import { HomeContent } from './HomeContent'

export const Home = () => {
  return (
    <HomeContextProvider>
      <HomeContent />
    </HomeContextProvider>
  )
}
