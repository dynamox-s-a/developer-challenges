import "./index.scss";

function formValidation() {
  var personName = document.forms["contactForm"]["name"].value;
  var personCompany = document.forms["contactForm"]["company"].value;
  var personEmail = document.forms["contactForm"]["email"].value;
  var personTel = document.forms["contactForm"]["telephone"].value;
  return alert(
    "Nome: " +
      personName +
      "\nEmpresa: " +
      personCompany +
      "\nEmail: " +
      personEmail +
      "\nTelefone: " +
      personTel
  );
}
export default function Form() {
  return (
    <div className="footer" id="contact">
      <span className="titleForm">
        Ficou com dúvida? <br /> Nós entramos em contato com você
      </span>
      <form
        name="contactForm"
        className="flex flex-col"
        onSubmit={formValidation}
      >
        <div className="form">
          <input
            type="text"
            name="name"
            className="input"
            placeholder="Como gostaria de ser chamado?"
          />
          <input
            type="text"
            name="company"
            className="input"
            placeholder="Em qual empresa você trabalha?"
          />
          <input
            type="email"
            name="email"
            className="input"
            placeholder="Digite aqui o seu email"
          />
          <input
            type="tel"
            name="telephone"
            className="input"
            placeholder="Qual o seu telefone?"
          />
          <input type="submit" className="buttonForm" />
        </div>
      </form>
    </div>
  );
}
