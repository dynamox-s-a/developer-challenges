import { FaExchangeAlt } from 'react-icons/fa'

export const getSort = ({ isSorted, isSortedDesc }) => {
  if (isSorted) {
    return isSortedDesc ? (
      <FaExchangeAlt style={{ transform: 'rotate(90deg)' }} />
    ) : (
      <FaExchangeAlt style={{ transform: 'rotate(270deg)' }} />
    )
  }

  return ''
}
