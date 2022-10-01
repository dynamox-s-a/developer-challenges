import './Summary.css'

export function Summary() {
  return (
    <div className='summary'>
      <p>
        <strong>Login: </strong>Digite seu email e senha nos campos destacados e clique em "EFETUAR LOGIN"
      </p>
      <p>
        <strong>Novo Produto: </strong>Clique no botão Adicionar no canto superior direito, irá abrir uma janela para preencher os campos campos, e clique no botão verde "ADICIONAR"
      </p>
      <p>
        <strong>Editar Produto: </strong>Clique no produto que deseja editar, irá abrir uma nova janela, clique no botão editar produto, edite o campo que deseja e clique no botão azul "EDITAR PRODUTO"
      </p>

      <p>
        <strong>Deletar Produto: </strong>Clique no produto que deseja deletar, irá abrir uma nova janela, clique no botão vermelho "DELETAR PRODUTO"
      </p>
    </div>
  )
}