import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import { Link } from "react-router-dom";
import { SidebarData } from './SidebarData';
import './Sidebar.css';
import { IconContext } from 'react-icons';


function Sidebar() {
    const [sidebar, setSidebar] = useState(false);


    const showSidebar = () =>  setSidebar(!sidebar);


    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <div onClick={showSidebar} className="navbar">
                    <Link to="#" className="menu-bars">
                        <FaIcons.FaBars />
                    </Link>
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'} >
                    <ul className="nav-menu-items" >
                        <li className="navbar-toggle" onClick={showSidebar}>
                            <Link to="#" className="menu-bars">
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span style={{marginLeft: "16px"}}>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    )

}

export default Sidebar;
