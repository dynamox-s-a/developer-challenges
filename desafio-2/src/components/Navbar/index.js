import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, logoutUser } from "../../features/user/userSlice";
import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import {
  ContanierNavbar,
  Navbarcenter,
  ToggleBtn,
  ContanierBtn,
  Btn,
  DowpDownBtn,
} from "./styles";

export const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const [showLogout, setShowLogout] = useState(false);
  const [showSmallbar, setShowSmallbar] = useState(false);
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(toggleSidebar());
  };
  return (
    <ContanierNavbar>
      <Navbarcenter>
        <ToggleBtn type="button" onClick={toggle}>
          <FaAlignLeft />
        </ToggleBtn>
        <ContanierBtn>
          <Btn type="button" onClick={() => setShowLogout(!showLogout)}>
            <FaUserCircle />
            {user?.name}
            <FaCaretDown />
          </Btn>
          {showLogout ? (
            <DowpDownBtn>
              <Btn type="button" onClick={() => dispatch(logoutUser())}>
                logout
              </Btn>
            </DowpDownBtn>
          ) : null}
        </ContanierBtn>
      </Navbarcenter>
    </ContanierNavbar>
  );
};
