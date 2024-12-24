import { 
  TextField, 
  Button,
  FormControl, 
  Typography
} from "@mui/material";
import { useLoginContext } from "./hooks/useLoginContext"
import { MainContainer } from "./styles"
import { useNavigate } from "react-router-dom"
import { Card, Snackbar } from '../../components'

export const LoginCard = () => {
  const navigate = useNavigate()
  const { 
    openSnackbar,
    submitDisabled,
    emailError,
    passwordError,
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
    handleCloseSnackbar
  } = useLoginContext()

  const { 
    alreadyFilled: emailAlreadyFilled,
    message: emailInputHelperText,
    visible: emailErrorVisible
  } = emailError

  const { 
    alreadyFilled: passwordAlreadyFilled,
    message: passwordInputHelperText,
    visible: passwordErrorVisible
  } = passwordError

  return (
    <MainContainer 
      direction="column" 
      justifyContent="center" 
      alignItems="center"
    >
      <Card onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Acesso
        </Typography>
        <FormControl>
          <TextField
            error={emailAlreadyFilled && emailErrorVisible}
            helperText={emailInputHelperText}
            label="E-mail"
            type="email"
            name="email"
            autoFocus
            autoComplete="email"
            required
            fullWidth
            variant="outlined"
            onChange={handleEmailChange}
            color={emailErrorVisible ? 'error' : 'primary'}
          />
        </FormControl>
        <FormControl>
          <TextField
            error={passwordAlreadyFilled && passwordErrorVisible}
            helperText={passwordInputHelperText}
            label="Senha"
            name="password"
            type="password"
            autoComplete="password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            onChange={handlePasswordChange}
            color={passwordErrorVisible ? 'error' : 'primary'}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={submitDisabled}
        >
          Entrar
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate('/users/create')}
        >
          Cadastrar Usuário
        </Button>
      </Card>
      <Snackbar
        snackbar={openSnackbar}
        onClose={handleCloseSnackbar}
      />
    </MainContainer>
  )
}
