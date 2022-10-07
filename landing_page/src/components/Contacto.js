const fetchFormData = () => {
    var name = document.getElementById('name').value;
    var company = document.getElementById('company').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;

    alert(`Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}`);
}

const Contacto = () => {
    return (
        <div className="contacts-container" id="contacto">
            <div className="contacts-content">
                <div className="contact-form">
                    <h2 style={{color : "white"}}>Ficou com dúvida?<br/>Nós entramos em contato com você</h2>
                    <form action="/" onSubmit={(e) => { e.preventDefault(); } }>
                        <input type="text" id="name" placeholder="Como gostaria de ser chamado?"></input>
                        <input type="text" id="company" placeholder="Em qual empresa você trabalha?"></input>
                        <input type="email" id="email" placeholder="Digite aqui o seu email"></input>
                        <input type="tel" id="phone" placeholder="Qual o seu telefone?"></input>
                        <button type="submit" onClick={fetchFormData}>Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contacto