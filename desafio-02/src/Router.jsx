import Home from './views/Home'
import Usuario from './views/Usuario'

const Routes = [
    {
        path: "/Homne",
        name: "Home",
        icon: "pe-7s-graph",
        component: Home,
        
      },
      {
        path: "/Usuario",
        name: "Usuario",
        icon: "pe-7s-graph",
        component: Usuario,
        
      },
];

export default Routes;