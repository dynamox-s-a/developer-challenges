import './App.css';
import Header from './pages/Header';

function App() {
  return (
    <>
      <div className="App">
      <header className="App-header">
      <div className="flex justify-center h-24">
        <div className="text-3xl font-bold ml-8">
          <h1 className="text-rose-200">Welcome to Burger Heaven</h1>
        </div>
      </div>
      </header>
    </div>
    <Header />
    </>

  );
}

export default App;
