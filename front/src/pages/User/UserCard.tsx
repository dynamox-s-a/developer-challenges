import { 
  TextField, 
  Button,
  FormControl,
  Typography
} from "@mui/material"
import { useUserContext } from "./hooks/useUserContext"
import { useNavigate } from "react-router-dom"
import { SignInContainer } from "../Login/styles"
import { useSelector } from "react-redux"
import { UserReduxState } from "../../redux"
import { useMemo } from "react"
import { Card, Snackbar } from '../../components'

export const UserCard = () => {
  const navigate = useNavigate()
  const user = useSelector((state: { user: UserReduxState }) => state.user)

  const { 
    handleSubmit,
    submitDisabled,
    openSnackbar,
    emailError,
    passwordError,
    confirmPasswordError,
    handleCloseSnackbar,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange
  } = useUserContext()

  const renderReturnButton = useMemo(() => {
    let text = 'Voltar'
    let route = '/login'
    if (user?.id) {
      text = 'Voltar ao Início' 
      route = '/home'
    }
    return (
      <Button
        fullWidth
        variant="contained"
        onClick={() => navigate(route)}
      >
        {text}
      </Button>
    )
  }, [navigate, user?.id])

  return (
    <SignInContainer
      direction="column" 
      justifyContent="center" 
      alignItems="center"
    >
      <Card onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          {user?.id ? 'Editar Usuário' : 'Cadastrar Usuário'}
        </Typography>
        <FormControl>
          <TextField
            error={emailError?.alreadyFilled && emailError?.visible}
            helperText={emailError?.message}
            label="E-mail"
            type="email"
            name="email"
            value={user?.email}
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={handleEmailChange}
            color={emailError?.visible ? 'error' : 'primary'}
          />
        </FormControl>
        <FormControl>
          <TextField
            error={passwordError?.alreadyFilled && passwordError?.visible}
            helperText={passwordError?.message}
            label="Senha"
            name="password"
            type="password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={handlePasswordChange}
            color={passwordError?.visible ? 'error' : 'primary'}
          />
        </FormControl>
        <FormControl>
          <TextField
            error={confirmPasswordError?.alreadyFilled && confirmPasswordError?.visible}
            helperText={confirmPasswordError?.message}
            label="Confirmar Senha"
            name="confirm-password"
            type="password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={handleConfirmPasswordChange}
            color={confirmPasswordError?.visible ? 'error' : 'primary'}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={submitDisabled}
        >
          {user?.id ? 'Confirmar' : 'Cadastrar'}
        </Button>
        {renderReturnButton}
      </Card>
      <Snackbar
        snackbar={openSnackbar}
        onClose={handleCloseSnackbar}
      />
    </SignInContainer>
  )
}
