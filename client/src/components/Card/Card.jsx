import './Card.css'

export function Card({ nome, dataFabricacao, perecivel, dataValidade, preco }) {
  return (
    <div className='card-component'>

      <h2>{nome}</h2>
      <h3>Data de fabricação: {dataFabricacao}</h3>
      <h3>Perecivel: {perecivel}</h3>
      <h3>Data de validade: {dataValidade}</h3>
      <h3>Preço: R${preco}</h3>

    </div>
  );
}