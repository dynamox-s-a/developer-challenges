import { FiLogOut } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from 'src/assets/logo-mini.png'
import { signOut } from 'src/store/slices/authThunk'

export const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <header className="h-[80px] bg-[#44142d] px-10 flex justify-between">
      <img className="w-full max-w-[80px]" src={logo} alt="logo" />
      <button
        className="flex items-center gap-1 text-[#fff]"
        onClick={() => {
          dispatch(signOut())
          navigate('/')
        }}
      >
        Sair
        <FiLogOut color="#fff" />
      </button>
    </header>
  )
}
