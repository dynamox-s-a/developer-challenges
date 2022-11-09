import { format } from 'date-fns'

export const columns = [
  {
    Header: 'Nome',
    accessor: 'name',
  },
  {
    Header: 'Data de fabricação',
    accessor: 'manufactureDate',
    Cell: ({ row }) => {
      const { manufactureDate } = row.original
      return format(new Date(manufactureDate), 'dd/MM/yyyy')
    },
  },
  {
    Header: 'Data de validade',
    accessor: 'expirationDate',
    Cell: ({ row }) => {
      const { expirationDate } = row.original
      return format(new Date(expirationDate), 'dd/MM/yyyy')
    },
  },
  {
    Header: 'Produto perecível',
    accessor: 'perishable',
    Cell: ({ row }) => {
      const { perishable } = row.original
      return perishable ? 'Sim' : 'Não'
    },
  },
  {
    Header: 'Preço',
    accessor: 'price',
    Cell: ({ row }) => {
      const { price } = row.original
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price)
    },
  },
  {
    Header: 'Ações',
    accessor: 'actions',
    disableSortBy: true,
  },
]
