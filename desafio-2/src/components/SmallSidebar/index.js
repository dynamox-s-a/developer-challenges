import React, { useState } from "react";
import {
  SidebarAside,
  SidebarContainer,
  Content,
  CloseBtn,
  ShowSidebarContainer,
} from "./styles";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../features/user/userSlice";
import { NavLinksComponent } from "../Navlinks";

export const SmallSidebar = () => {
  const { isSidebarOpen } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(toggleSidebar());
  };
  return (
    <SidebarAside>
      {!isSidebarOpen ? (
        <ShowSidebarContainer>
          <SidebarContainer>
            <Content>
              <CloseBtn type="button" onClick={toggle}>
                <FaTimes />
              </CloseBtn>
            </Content>
          </SidebarContainer>
        </ShowSidebarContainer>
      ) : (
        <SidebarContainer>
          <Content>
            <CloseBtn type="button" onClick={toggle}>
              <FaTimes />
            </CloseBtn>
            <NavLinksComponent toggleSidebar={toggle} />
          </Content>
        </SidebarContainer>
      )}
    </SidebarAside>
  );
};
