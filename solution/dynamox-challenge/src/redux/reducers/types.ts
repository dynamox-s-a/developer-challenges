export interface INITIAL_STATE {
  user: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null,
  isLoggedIn: boolean,
}
// define os tipos de dados que serão utilizados no reducer