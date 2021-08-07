import GlobalStyle from "./styles/global";
import Dashboard from "./pages/Dashboard/";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div className="App">
      <ToastContainer
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Dashboard/>
      <GlobalStyle />
    </div>
  );
}

export default App;
