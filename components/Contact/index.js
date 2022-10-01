import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import Container from '../Container'

import * as S from './styles'

function Contact() {
  const schema = zod.object({
    name: zod.string().min(1).max(50),
    company: zod.string().min(1).max(50),
    email: zod.string().email(),
    phone: zod.string().min(1)
  })

  const { register, handleSubmit, formState: { isValid } } = useForm({ mode: 'onChange', resolver: zodResolver(schema)});
  
  function onSubmit(data) {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <S.ContactContainer id="contato">
      <Container>
        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <h2>Ficou com dúvida? <br /> Nós entramos em contato com você</h2>
          <S.InputsContainer>
            <input {...register("name")} placeholder="Como gostaria de ser chamado?" />
            <input {...register("company")} placeholder="Em qual empresa você trabalha?" />
            <input type="email" {...register("email")} placeholder="Digite aqui o seu email" />
            <input {...register("phone")} placeholder="Qual o seu telefone?" />
          </S.InputsContainer>
          <button type="submit" disabled={!isValid}>enviar</button>
        </S.Form>
      </Container>
    </S.ContactContainer>
  )
}

export default Contact