import { Home } from './pages/Home/Home'
import { Header } from './components/Header/Header'
import { Summary } from './components/Summary/Summary'

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
      <Summary />
    </div>
  );
}

export default App;
