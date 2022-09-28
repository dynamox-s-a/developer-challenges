import './Form.css'
import Button from '@mui/material/Button';

export function Form() {

  function Submit(event) {
    event.preventDefault();

    const newForm = {
      name: event.target.name.value,
      work: event.target.work.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
    }

    alert(`Nome: ${newForm.name}
Trabalho: ${newForm.work}
E-mail: ${newForm.email}
Telefone: ${newForm.phone}`);

    event.target.name.value = ""
    event.target.work.value = ""
    event.target.email.value = ""
    event.target.phone.value = ""
  }

  return (

    <div className="form" id="contact">
      <div className='form-text'>
        <p>Ficou com dúvida?</p>
        <p>Nós entramos em contato com você</p>
      </div>
      <form className="form-inputs" onSubmit={Submit}>
        <section className='form-input'>
          <input className='form-name'
            type="text"
            name="name"
            placeholder='Como gostaria de ser chamado?'
          ></input>
        </section>
        <section className='form-input'>
          <input className='form-work'
            type="text"
            name="work"
            placeholder='Em qual empresa você trabalha?'
          ></input>
        </section>
        <section className='form-input'>
          <input className='form-email'
            type='email'
            name="email"
            placeholder='Digite aqui o seu email'
          ></input>
        </section>
        <section className='form-input'>
          <input className='form-phone'
            type="tel"
            name="phone"
            placeholder='Qual o seu telefone?'
          ></input>
        </section>
        <br />
        <Button className='btn-form' variant="contained" size="medium" type='submit'>
          ENVIAR
        </Button>
      </form>
    </div>
  );
};