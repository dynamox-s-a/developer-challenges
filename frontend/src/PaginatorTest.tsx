import { Link, useSearchParams } from 'react-router-dom';
import { mockMachines } from './utils/mocks';
import type { MachineType } from './MachineCard';
import MachineCard from './MachineCard';
import useAuth from './useAuth';
import './Paginator.css';

export default function PaginatorTest() {
  const machines = mockMachines;
  const auth = useAuth();

  return (
    <div>
      <h1>Página de sensores</h1>
      <ul>
        <li>
          <Link to="/sensors">sensors</Link>
        </li>
        <li>
          <Link to="/machines">machines</Link>
        </li>
        <li>
          <Link to="" onClick={() => auth?.logout()}>
            Logout
          </Link>
        </li>
      </ul>
      <Paginator data={machines} max={5} />
    </div>
  );
}

export function Paginator(props: { data: MachineType[]; max: number }) {
  const { data, max } = props;
  const pagesQtd = Math.ceil(data.length / max);
  const arrPages = Array.from({ length: pagesQtd }, (_, index) => index + 1);
  
  const [search, setSearchParams] = useSearchParams();
  const page = search.get('page');
  const currentPage = +(page || 1);

  return (
    <>
      <div id="paginator-item-box">
        {data
          .filter(
            (_, i) =>
              i + 1 <= currentPage * max && i + 1 > max * (currentPage - 1)
          )
          .map((a, k) => MachineCard({ key: k, machine: a }))}
      </div>
      {data.length == 0 && (
        <div>
          <h3>Add Machine</h3>
        </div>
      )}
      {data.length > max && (
        <div id="paginator-line">
          {
            <button
              disabled={!(currentPage > 1)}
              onClick={() => {
                search.set('page', `${currentPage - 1}`);
                setSearchParams(search);
              }}
            >
              Prev
            </button>
          }
          {arrPages.map((n, k: number) => (
            <span
              className={`${currentPage == n && 'muted'}`}
              key={k}
              onClick={() => {
                if (currentPage == n) return;
                search.set('page', `${n}`);
                setSearchParams(search);
              }}
            >
              {n}
            </span>
          ))}
          {
            <button
              disabled={currentPage == pagesQtd}
              onClick={() => {
                search.set('page', `${currentPage + 1}`);
                setSearchParams(search);
              }}
            >
              Next
            </button>
          }
        </div>
      )}
    </>
  );
}
