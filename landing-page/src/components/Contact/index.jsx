import './styles.css';

export function Contact() {
  return(
    <section className="grid-pattern contact">
      <div className="contact-section">

        <div className="contact-content">
          <h3 className="title">
            Ficou com dúvida? <br /> 
            Nós entramos em contato com você
          </h3>

          <div className="contact-form">
            <input type="text" placeholder="Como gostaria de ser chamado?" />
            <input type="text" placeholder="Em qual empresa você trabalha?" />
            <input type="email" placeholder="Digite aqui o seu email" />
            <input type="text" placeholder="Qual o seu telefone?" />
            <button>Enviar</button>
          </div>
        </div>
        
      </div>
    </section>
  )
}