import { Provider } from 'react-redux';
import AppRoutes from './Routes';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
