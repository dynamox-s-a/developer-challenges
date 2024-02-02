import { Link } from "react-router-dom"

export const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Link to={"/data"}>EITA </Link>
      </header>
    </div>
  )
}
