import Button from "../Button";
import Input from "../Input";
import { Container, Form } from "./styles";
import {useForm} from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from '@hookform/resolvers/yup'
import { useState } from "react"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () =>{
    
    const [form, setForm] = useState(true)
    const PhoneValidation = /\(?([0-9]{2})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    const forSchema = yup.object().shape({
        name: yup.string().max(22, "Maxímo de 22 dígitos"),
        email: yup.string().required("Email Obrigatótio").email("Email Inválido"),
        cellphone: yup.string().required("Telefone Obrigatótio").matches(PhoneValidation, "(xx)xxxxx-xxxx"),
        company: yup.string(),
      })
    const{register, handleSubmit, formState:{errors}} = useForm({
        resolver: yupResolver(forSchema)
    });

    
    const onSubmitFunction = (data) => {
        setForm(data)
        toast.info(`NOME: ${form.name}`);
        toast.info(`EMPRESA: ${form.company}`);
        toast.info(`E-MAIL: ${form.email}`);
        toast.info(`TELEFONE: ${form.cellphone}`);
      };
    
    return(
        <Container>

            <h1>Ficou com dúvida?</h1>
            <h1>Nós entramos em contato com você</h1>
            <form>
                <Form>
                    <Input
                    placeholder="Como gostaria de ser chamado"
                    register={register}
                    name="name"
                    error={errors.name?.message}form
                    setHeight="70px"
                    setWidth="100%"
                    />
                    <Input
                    placeholder="Em qual empresa você trabalha?"
                    register={register}
                    name="company"
                    error={errors.company?.message}
                    setHeight="70px"
                    setWidth="100%"
                    />
                    <Input
                    placeholder="Digite aqui o seu email"
                    register={register}
                    name="email"
                    error={errors.email?.message}
                    setHeight="70px"
                    setWidth="100%"
                    />  
                    <Input
                    placeholder="Qual o seu telefone?"
                    register={register}
                    name="cellphone"
                    error={errors.cellphone?.message}
                    setHeight="70px"
                    setWidth="100%"
                    />
                    <Button setClick={handleSubmit(onSubmitFunction)} type="submit" width = 'large' setColor='#0165DB' setSize='giant'> Enviar </Button>
                </Form>
            </form>

        </Container>
    );
};export default Footer
