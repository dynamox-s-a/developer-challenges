import { Home } from './pages/Home/Home'
import { Header } from './components/Header/Header'
import { Summary } from './components/Summary/Summary'
import { Login } from './components/Login/Login'

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
      <Login />
      <Summary />
    </div>
  );
}

export default App;
