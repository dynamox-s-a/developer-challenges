import { AppDispatch } from '@/store';
import { logout } from '@/store/auth/authSlice';

export function handleLogout(dispatch: AppDispatch) {
  dispatch(logout());

  document.cookie = 'token=; Max-Age=0; path=/';
  document.cookie = 'user=; Max-Age=0; path=/';

}