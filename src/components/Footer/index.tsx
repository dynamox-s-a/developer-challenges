import { SubmitHandler, useForm } from "react-hook-form";
import { Container, Title, Input, ContainerForm, Button } from "./styles";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { ErrorText } from "../ErrorText";

export const errorStyle = {
  color: "#D10202",
  fontSize: "14px",
};

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
};

export function Footer() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isShowAlert, isSetShowAlert] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    setIsFormSubmitted(true);
    isSetShowAlert(true);

    setTimeout(() => {
      isSetShowAlert(false);
    }, 3000);
  };

  return (
    <Container id="contato">
      <Title>
        Ficou com dúvida? <br /> Nós entramos em contato com você
      </Title>

      <ContainerForm onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Como gostaria de ser chamado?"
          {...register("name", {
            required: "O campo é obrigatório",
            maxLength: 40,
          })}
        ></Input>
        <ErrorText errors={errors} name="name" errorStyle={errorStyle} />

        <Input
          placeholder="Em qual empresa você trabalha?"
          {...register("company", {
            required: "O campo é obrigatório",
            maxLength: 40,
          })}
        ></Input>
        <ErrorText errors={errors} name="company" errorStyle={errorStyle} />

        <Input
          placeholder="Digite aqui o seu email?"
          {...register("email", {
            required: "O campo é obrigatório",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Digite um email válido",
            },
            maxLength: 40,
          })}
        ></Input>
        <ErrorText errors={errors} name="email" errorStyle={errorStyle} />

        <Input
          placeholder="Qual o seu telefone?"
          {...register("phone", { required: "O campo é obrigatório" })}
        ></Input>
        <ErrorText errors={errors} name="phone" errorStyle={errorStyle} />

        {isFormSubmitted && isShowAlert && (
          <Alert severity="success">Dados enviados com sucesso!</Alert>
        )}

        <Button type="submit">ENVIAR</Button>
      </ContainerForm>
    </Container>
  );
}
