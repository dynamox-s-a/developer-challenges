import React from "react";
import { IPrivateRouteProps } from "../types";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/auth.slice";
import Redirect from "../components/Redirect";

const PrivateRoute = ({ children }: IPrivateRouteProps) => {
  const { token } = useSelector(selectAuth);
  return <div>{token ? children : <Redirect />}</div>;
};

export default PrivateRoute;
