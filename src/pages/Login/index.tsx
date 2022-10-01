import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import { Logo } from '../../components/Logo'

import { useAppDispatch } from '../../store/hooks'
import * as S from './styles'
import { authLogin } from '../../store/fetchActions'

const schema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(4),
})

type LoginSchemaType = zod.infer<typeof schema>

export function Login() {
  const { register, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(schema),
  })

  const dispatch = useAppDispatch()

  async function handleLogin(data: LoginSchemaType) {
    dispatch(authLogin(data))
  }

  return (
    <S.LoginContainer>
      <S.ContentContainer>
        <Logo />
        <S.Form onSubmit={handleSubmit(handleLogin)}>
          <input type="email" {...register('email')} placeholder="Email" />
          <input
            type="password"
            {...register('password')}
            placeholder="Senha"
          />
          <button type="submit">Log in</button>
        </S.Form>
      </S.ContentContainer>
    </S.LoginContainer>
  )
}
