import { Button } from 'src/components/Button'
import { Input } from 'src/components/Input'
import { useDispatch, useSelector } from 'react-redux'
import { login } from 'src/store/slices/authThunk'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import logo from 'src/assets/logo.png'
import logoMini from 'src/assets/logo-mini.png'

export const Login = () => {
  const dispatch = useDispatch()
  const { loading, error, token } = useSelector(state => state.auth)
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  useEffect(() => {
    if (error) {
      toast('Usuário ou senha inválidos', {
        type: 'error',
      })
    }
  }, [error])

  useEffect(() => {
    if (token) {
      navigate('/produtos')
    }
  }, [token, navigate])

  return (
    <section className="min-h-screen flex md:grid md:grid-cols-[60%,40%]">
      <aside className="bg-[#44142d] hidden md:flex justify-center items-center flex-col">
        <img src={logo} alt="logo" className="w-20rem" />
      </aside>
      <aside className="w-full bg-[#F7F7F7] flex md:justify-center items-center flex-col px-14">
        <img src={logoMini} alt="logo" className="md:hidden w-10rem mb-10" />
        <form
          className="w-full md:max-w-20rem flex justify-center flex-col items-center"
          onSubmit={handleSubmit(data => dispatch(login(data)))}
        >
          <Input
            type="email"
            placeholder="E-mail"
            value="vitor@dynamox.com.br"
            {...register('email')}
          />
          <Input
            placeholder="Senha"
            type="password"
            className="mt-2"
            value="dynamox"
            {...register('password')}
          />
          <Button
            type="submit"
            className="mt-2"
            isLoading={loading}
            disabled={loading}
          >
            LOGIN
          </Button>
        </form>
      </aside>
    </section>
  )
}
