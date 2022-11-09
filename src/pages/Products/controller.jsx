import { FiEdit } from 'react-icons/fi'
import { api } from 'src/services/api'

export const getProducts = async ({ page, setModalEditProduct }) => {
  const response = await api('/products', {
    params: {
      _page: page,
      _limit: 10,
      _order: 'desc',
      _sort: 'id',
    },
  })
  return {
    data: response.data.map(product => ({
      ...product,
      actions: (
        <button
          onClick={() => {
            setModalEditProduct({
              isOpen: true,
              data: product,
            })
          }}
        >
          <FiEdit />
        </button>
      ),
    })),
    total: +response.headers['x-total-count'],
  }
}
