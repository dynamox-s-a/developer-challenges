import { NavLink } from "react-router";
import './Home.scss'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function Home() {
    return (
        <>
        <div>
            Bem Vindo(a)!
        </div>
        <div>
            <NavLink
                to="/data"
            >
                Veja os Graficos!
            </NavLink>
        </div>
        </>
    )
}

export default Home
