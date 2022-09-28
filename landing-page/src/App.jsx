import { Intro } from "./components/Intro"
import { Header } from "./components/Header"
import { Sensors } from "./components/Sensors"
import { Contact } from "./components/Contact"

function App() {
  return (
    <div>
      <Header />
      <Intro />
      <Sensors />
      <Contact />
    </div>
  )
}

export default App