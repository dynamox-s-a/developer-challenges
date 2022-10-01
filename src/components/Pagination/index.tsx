import * as S from './styles'

interface Props {
  productsPerPage: number
  totalProducts: number
  currentPage: number
  paginate: (number: number) => void
}

export function Pagination({
  productsPerPage,
  totalProducts,
  currentPage,
  paginate,
}: Props) {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <S.PaginationContainer>
      <ul>
        {pageNumbers.map((number) => (
          <S.Item
            key={number}
            onClick={() => {
              paginate(number)
            }}
            active={currentPage === number}
          >
            {number}
          </S.Item>
        ))}
      </ul>
    </S.PaginationContainer>
  )
}
