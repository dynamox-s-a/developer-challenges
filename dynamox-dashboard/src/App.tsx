import { Navigate, Route, Routes } from 'react-router-dom'
import { DataPage } from './pages/data/DataPage'

function App() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/data" />} path="*" />
      <Route element={<DataPage />} path="/data" />
    </Routes>
  )
}

export default App
