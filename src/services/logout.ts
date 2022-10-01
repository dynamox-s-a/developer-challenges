import { logoutAction } from '../store/ducks/auth'

export default function Logout() {
  sessionStorage.removeItem('@dynamox-challenge-02-token')
  return logoutAction()
}
