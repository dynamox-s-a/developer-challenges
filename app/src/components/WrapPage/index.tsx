import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar';

function WrapPage() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default WrapPage;
