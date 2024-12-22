import { 
  TextField, 
  Button,
  FormControl, 
  Typography
} from "@mui/material";
import { useLoginContext } from "./hooks/useLoginContext"
import { SignInContainer } from "./styles"
import { useNavigate } from "react-router-dom"
import { Card } from '../../components'

export const LoginCard = () => {
  const navigate = useNavigate()
  const { 
    handleSubmit,
    submitDisabled,
    emailError,
    passwordError,
    handleEmailChange,
    handlePasswordChange
  } = useLoginContext()

  return (
    <SignInContainer 
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
            error={emailError?.alreadyFilled && emailError?.visible}
            helperText={emailError?.message}
            label="E-mail"
            type="email"
            name="email"
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
    </SignInContainer>
  )
}
