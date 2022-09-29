import * as S from './styles'

export function Edit() {
  return (
    <>
      <h1>Editar produto</h1>
      <S.Form>
        <S.InputContainer>
          <label htmlFor="product_name">Nome</label>
          <input
            type="text"
            name="product_name"
            placeholder="Ex: Sabão em pó"
          />
        </S.InputContainer>
        <S.InputContainer>
          <label htmlFor="manufacturing_date">Data de fabricação</label>
          <input
            type="text"
            name="manufacturing_date"
            placeholder="Ex: 01/01/2022"
          />
        </S.InputContainer>
        <S.InputContainer>
          <label htmlFor="expiration_date">Data de validade</label>
          <input
            type="text"
            name="expiration_date"
            placeholder="Ex: 01/01/2023"
          />
        </S.InputContainer>
        <S.InputContainer>
          <label htmlFor="price">Data de validade</label>
          <input type="text" name="price" placeholder="R$4,00" />
        </S.InputContainer>
        <S.CheckBoxContainer>
          <label htmlFor="perishable">Produto perecível</label>
          <input type="checkbox" name="perishable" />
        </S.CheckBoxContainer>
        <button type="submit">Salvar</button>
      </S.Form>
    </>
  )
}
