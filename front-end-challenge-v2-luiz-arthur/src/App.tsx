import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataRequest } from './store/modules/sensorSlice';
import type { RootState } from './store';

function App() {
  const dispatch = useDispatch();
  const { loading, acceleration, velocity, temperature, error } = useSelector(
    (state: RootState) => state.sensor
  );

  useEffect(() => {
    dispatch(fetchDataRequest());
  }, [dispatch]);

  console.log('🔍 Estado do Redux:', { loading, acceleration, velocity, temperature, error });

  return <div>Veja o console e o Redux DevTools!</div>;
}

export default App;