import { Pencil, PlusCircle, Trash } from 'phosphor-react'
import * as S from './styles'

export function Home() {
  return (
    <>
      <S.Header>
        <h1>Produtos</h1>
        <button>
          <PlusCircle size={16} />
          Criar
        </button>
      </S.Header>
      <S.TableContainer>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data de fabricação</th>
              <th>Produto perecível</th>
              <th>Data de validade</th>
              <th>Preço</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Amaciante em Pó</td>
              <td>27/08/2022</td>
              <td>Não</td>
              <td>27/10/2022</td>
              <td>R$11,99</td>
              <td>
                <S.EditProductContainer>
                  <S.IconContainer title="Editar">
                    <Pencil size={24} />
                  </S.IconContainer>
                  <S.IconContainer title="Excluir">
                    <Trash size={24} />
                  </S.IconContainer>
                </S.EditProductContainer>
              </td>
            </tr>
            <tr>
              <td>Amaciante em Pó</td>
              <td>27/08/2022</td>
              <td>Não</td>
              <td>27/10/2022</td>
              <td>R$11,99</td>
              <td>
                <S.EditProductContainer>
                  <S.IconContainer title="Editar">
                    <Pencil size={24} />
                  </S.IconContainer>
                  <S.IconContainer title="Excluir">
                    <Trash size={24} />
                  </S.IconContainer>
                </S.EditProductContainer>
              </td>
            </tr>
            <tr>
              <td>Amaciante em Pó</td>
              <td>27/08/2022</td>
              <td>Não</td>
              <td>27/10/2022</td>
              <td>R$11,99</td>
              <td>
                <S.EditProductContainer>
                  <S.IconContainer title="Editar">
                    <Pencil size={24} />
                  </S.IconContainer>
                  <S.IconContainer title="Excluir">
                    <Trash size={24} />
                  </S.IconContainer>
                </S.EditProductContainer>
              </td>
            </tr>
            <tr>
              <td>Amaciante em Pó</td>
              <td>27/08/2022</td>
              <td>Não</td>
              <td>27/10/2022</td>
              <td>R$11,99</td>
              <td>
                <S.EditProductContainer>
                  <S.IconContainer title="Editar">
                    <Pencil size={24} />
                  </S.IconContainer>
                  <S.IconContainer title="Excluir">
                    <Trash size={24} />
                  </S.IconContainer>
                </S.EditProductContainer>
              </td>
            </tr>
            <tr>
              <td>Amaciante em Pó</td>
              <td>27/08/2022</td>
              <td>Não</td>
              <td>27/10/2022</td>
              <td>R$11,99</td>
              <td>
                <S.EditProductContainer>
                  <S.IconContainer title="Editar">
                    <Pencil size={24} />
                  </S.IconContainer>
                  <S.IconContainer title="Excluir">
                    <Trash size={24} />
                  </S.IconContainer>
                </S.EditProductContainer>
              </td>
            </tr>
            <tr>
              <td>Amaciante em Pó</td>
              <td>27/08/2022</td>
              <td>Não</td>
              <td>27/10/2022</td>
              <td>R$11,99</td>
              <td>
                <S.EditProductContainer>
                  <S.IconContainer title="Editar">
                    <Pencil size={24} />
                  </S.IconContainer>
                  <S.IconContainer title="Excluir">
                    <Trash size={24} />
                  </S.IconContainer>
                </S.EditProductContainer>
              </td>
            </tr>
            <tr>
              <td>Amaciante em Pó</td>
              <td>27/08/2022</td>
              <td>Não</td>
              <td>27/10/2022</td>
              <td>R$11,99</td>
              <td>
                <S.EditProductContainer>
                  <S.IconContainer title="Editar">
                    <Pencil size={24} />
                  </S.IconContainer>
                  <S.IconContainer title="Excluir">
                    <Trash size={24} />
                  </S.IconContainer>
                </S.EditProductContainer>
              </td>
            </tr>
            <tr>
              <td>Amaciante em Pó</td>
              <td>27/08/2022</td>
              <td>Não</td>
              <td>27/10/2022</td>
              <td>R$11,99</td>
              <td>
                <S.EditProductContainer>
                  <S.IconContainer title="Editar">
                    <Pencil size={24} />
                  </S.IconContainer>
                  <S.IconContainer title="Excluir">
                    <Trash size={24} />
                  </S.IconContainer>
                </S.EditProductContainer>
              </td>
            </tr>
            <tr>
              <td>Amaciante em Pó</td>
              <td>27/08/2022</td>
              <td>Não</td>
              <td>27/10/2022</td>
              <td>R$11,99</td>
              <td>
                <S.EditProductContainer>
                  <S.IconContainer title="Editar">
                    <Pencil size={24} />
                  </S.IconContainer>
                  <S.IconContainer title="Excluir">
                    <Trash size={24} />
                  </S.IconContainer>
                </S.EditProductContainer>
              </td>
            </tr>
            <tr>
              <td>Amaciante em Pó</td>
              <td>27/08/2022</td>
              <td>Não</td>
              <td>27/10/2022</td>
              <td>R$11,99</td>
              <td>
                <S.EditProductContainer>
                  <S.IconContainer title="Editar">
                    <Pencil size={24} />
                  </S.IconContainer>
                  <S.IconContainer title="Excluir">
                    <Trash size={24} />
                  </S.IconContainer>
                </S.EditProductContainer>
              </td>
            </tr>
          </tbody>
        </table>
      </S.TableContainer>
    </>
  )
}
