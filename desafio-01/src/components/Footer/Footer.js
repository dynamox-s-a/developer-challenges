import styles from './Footer.module.css'
import Button from '../Button/Button.js';
import React, { useState } from "react";

const Footer = () => {
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    
    const handleSubmit = (evt) => {
        evt.preventDefault();
        alert(`Nome: ${name}\nEmpresa: ${company}\nE-mail: ${email}\nTelefone: ${tel}\n`);
    }

    return (
        <footer id="Footer" className={styles.footer_container}>
            <h3 className={styles.footer_title}>Ficou com dúvida? <br />
            Nós entramos em contato com você</h3>
            <form className={styles.footer_form}>
                <input type="text" id="contato_nome" onChange={e => setName(e.target.value)} className={styles.footer_form_input} placeholder="Como gostaria de ser chamado?" />
                <input type="text" id="contato_empresa" onChange={e => setCompany(e.target.value)} className={styles.footer_form_input} placeholder="Em qual empresa você trabalha?" />
                <input type="email" id="contato_email" onChange={e => setEmail(e.target.value)} className={styles.footer_form_input} placeholder="Digite aqui o seu email" />
                <input type="tel" id="contato_telefone" onChange={e => setTel(e.target.value)} className={styles.footer_form_input} placeholder="Qual o seu telefone?" />
                <Button onClick={handleSubmit} type="submit" className={styles.footer_form_button}>ENVIAR</Button>
            </form>
        </footer>
    );
}

export default Footer;
