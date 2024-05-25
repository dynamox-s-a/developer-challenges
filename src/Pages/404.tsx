import { Link } from "@mui/material";

export function NotFound() {
  return (
    <div>
      <h1>Página não encontrada</h1>
      <p>
        Volta para o{' '}
        <Link href="/">
          Home
        </Link>
      </p>
    </div>
  )
}
