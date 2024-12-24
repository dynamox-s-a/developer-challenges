export type InputErrorControlType = {
  alreadyFilled?: boolean
  visible: boolean
  type?: 'success' | 'info' | 'warning' | 'error'
  message: string
}

export type UserContextType = {
  loading: boolean
  emailError: InputErrorControlType
  passwordError: InputErrorControlType
  confirmPasswordError: InputErrorControlType
  openSnackbar: InputErrorControlType
  submitDisabled: boolean
  handleCloseSnackbar: () => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}


