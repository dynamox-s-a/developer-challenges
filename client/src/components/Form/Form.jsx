import './Form.css'
import Button from '@mui/material/Button';

export function Form() {
  return (

    <div className="form">
      <div className='form-text'>
        <p>Ficou com dúvida?</p>
        <p>Nós entramos em contato com você</p>
      </div>
      <form className="form-inputs">
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