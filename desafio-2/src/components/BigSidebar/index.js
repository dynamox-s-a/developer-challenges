import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Contanier, SidebarContanier, Content } from "./styles";
import { NavLinksComponent } from "../Navlinks";
import { toggleSidebar } from "../../features/user/userSlice";

export const BigSidebar = () => {
  const { isSidebarOpen } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const toggle = (e) => {
    console.log(e.target);
    dispatch(toggleSidebar());
  };
  return (
    <Contanier>
      {isSidebarOpen ? (
        <SidebarContanier>
          <Content>
            <NavLinksComponent toggleSidebar={toggle} />
          </Content>
        </SidebarContanier>
      ) : null}
    </Contanier>
  );
};
