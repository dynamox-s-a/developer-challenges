import React, {useState} from "react";

import {authLogin} from "../../store/fethActions";
import {useDispatch} from "react-redux";

import {Form, Button} from "react-bootstrap";

export default function Login() {
  const [form, setForm] = useState({email: "", password: ""});

  const dispatch = useDispatch();

  function changeForm(e) {
    const {name, value} = e.target;

    setForm({...form, [name]: value});
  }

  function submitForm(e) {
    e.preventDefault();

    dispatch(authLogin(form));

    setForm({email: "", password: ""});
  }

  return (
    <Form
      onSubmit={submitForm}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: 350,
        height: "100vh",
        margin: "auto",
      }}
    >
      <h2 className="text-center">Login</h2>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          placeholder="Email"
          onChange={changeForm}
          name="email"
          className="form-control"
          value={form.email}
          type="email"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Senha</Form.Label>
        <Form.Control
          placeholder="Senha"
          onChange={changeForm}
          name="password"
          className="form-control"
          type="password"
          value={form.password}
        />
      </Form.Group>
      <Form.Group className="mx-auto">
        <Button className="primary" type="submit">
          Entrar
        </Button>
      </Form.Group>
    </Form>
  );
}
