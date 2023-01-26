import * as React from "react";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./Header";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Header({ pageRef }) {
  const mobile = useMediaQuery("(max-width:767px)");
  return (
    <>
      {mobile ? (
        <HeaderMobile pageRef={ pageRef } />
      ) : (
        <HeaderDesktop pageRef={ pageRef } />
      )}
    </>
  );
}
