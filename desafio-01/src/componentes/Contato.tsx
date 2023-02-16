import React, { use, useState } from "react";
import style from "./contato.module.css";

export default function Contact() {
    const [name, setName] = useState('');
    const [work, setWork] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const submitData = () => {
        
        window.alert(`${name}, ${work}, ${email}, ${phone}`);
    }
    return (
        <>
        <div className={style.footer} id="contato">
            <div className={style.maxWidth}>
                <div className={style.content}>
                    <div className={style.title}>
                    Ficou com dúvida? <br />Nós entramos em contato com você
                    </div>
                    <div className={style.inputs}>
                        <input type="text" placeholder="Como gostaria de ser chamado?" onChange={e => setName(e.target.value)} value={name} name="name" />
                        <input type="text" placeholder="Em qual empresa você trabalha?" onChange={e => setWork(e.target.value)} value ={work} name="work"/>
                        <input type="email" placeholder="Digite aqui seu email" onChange={e => setEmail(e.target.value)} value={email} name="email"/>
                        <input type="tel" placeholder="Qual o seu telefone?" onChange={e => setPhone(e.target.value)} value={phone} name="phone"/>
                    </div>
                    <button type="button" onClick={submitData}>ENVIAR</button>
                </div>
            </div>
        </div>
            
        </>
    )
}