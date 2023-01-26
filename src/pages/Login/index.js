import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Auth from "../../layouts/Auth";
import LoginForm from "../../components/Form/index";
import { Title } from "./styles";

export default function Login() {
  return (
    <Auth>
      <Title>Login</Title>
      <LoginForm />
    </Auth>
  );
}
