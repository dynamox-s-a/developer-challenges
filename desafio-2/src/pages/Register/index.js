import React from "react";
import { useState, useEffect } from "react";
import {
  Registerpg,
  FromContanier,
  Title,
  ButtonStyle,
  ToggleIsMember,
  IsMemberBtn,
} from "./styles";
import { Button } from "../../components/Button";
import { FormRow } from "../../components/FormRow";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../store";
import { loginUser, registerUser } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

export const Register = () => {
  const [values, setValues] = useState(initialState);
  const { user, isLoading } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(value);
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      toast.error("Preencha todos os campos!");
      return;
    }
    if (isMember) {
      dispatch(
        loginUser({
          email,
          password,
        })
      );
      return;
    }
    dispatch(
      registerUser({
        email,
        password,
        name,
      })
    );
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [user]);

  return (
    <Registerpg>
      <FromContanier onSubmit={onSubmit}>
        <Title>{values.isMember ? "Login" : "Registrar"}</Title>
        {!values.isMember && (
          <FormRow
            htmlFor="name"
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
            placeholder="Nome da sua conta  "
          >
            name:
          </FormRow>
        )}

        <FormRow
          htmlFor="email "
          type="text"
          name="email"
          value={values.email}
          handleChange={handleChange}
          placeholder="Qual o seu e-mail // (usar: EmailTeste@gmail.com)"
        >
          e-mail:
        </FormRow>

        <FormRow
          htmlFor="password"
          type="text"
          name="password"
          value={values.password}
          handleChange={handleChange}
          placeholder="password (usar: senhateste)"
        >
          password:
        </FormRow>

        <ButtonStyle>
          <Button
            type="submit"
            title="Submit"
            onClick={onSubmit}
            disable={isLoading}
          />
        </ButtonStyle>
        <ToggleIsMember>
          {values.isMember ? "Você é membro?" : "Voce já é membro"}
          <IsMemberBtn type="button" onClick={toggleMember}>
            {!values.isMember ? "Login" : "Registrar"}
          </IsMemberBtn>
        </ToggleIsMember>
      </FromContanier>
    </Registerpg>
  );
};
