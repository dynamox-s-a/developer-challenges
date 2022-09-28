import Container from '../Container'

import * as S from './styles'

function Contact() {
  return (
    <S.ContactContainer>
      <Container>
        <S.Form>
          <h2>Ficou com dúvida? <br /> Nós entramos em contato com você</h2>
          <S.InputsContainer>
            <input type="text" placeholder="Como gostaria de ser chamado?" />
            <input type="text" placeholder="Em qual empresa você trabalha?" />
            <input type="text" placeholder="Digite aqui o seu email" />
            <input type="text" placeholder="Qual o seu telefone?" />
          </S.InputsContainer>
          <button type="submit">enviar</button>
        </S.Form>
      </Container>
    </S.ContactContainer>
  )
}

export default Contact