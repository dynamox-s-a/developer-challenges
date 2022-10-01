import './Login.css'
import { apiLogin } from '../../utils/Api/Api'

async function loginSubmit(event) {
  event.preventDefault();

  const login = {
    email: event.target.email.value,
    password: event.target.password.value,
  }
  await apiLogin.loginAPI(login)
}

export function Login() {
  return (
    <div className="form-login">
      <form onSubmit={loginSubmit} className="form-login">
        <section>
          <span>E-mail: </span>
          <input className='form-email'
            type="email"
            name="email"
            placeholder='Digite seu e-mail'
          ></input>
        </section>
        <section>
          <span>Password: </span>
          <input className='form-password'
            type="password"
            name="password"
            placeholder='Digite seu password'
          ></input>
        </section><br />
        <button type="submit-login" className="btn-submit-login">
          EFETUAR LOGIN
        </button>
      </form>
    </div>
  )
}