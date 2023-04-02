import Contact from "./components/Contact/Contact"
import Header from "./components/Header/Header"
import Home from "./components/Home/Home"
import Sensors from "./components/Sensors/Sensors"

function App() {

  return (
    <div className="h-screen">
      <Header />
      <main>
        <Home />
        <Sensors />
        <Contact />
      </main>
    </div>
  )
}

export default App
