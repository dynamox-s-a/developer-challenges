import { InputErrorControlType } from "../../User/types"

export type LoginContextType = {
  loading: boolean
  emailError: InputErrorControlType
  passwordError: InputErrorControlType
  submitDisabled: boolean
  openSnackbar: InputErrorControlType
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleCloseSnackbar: () => void
}


