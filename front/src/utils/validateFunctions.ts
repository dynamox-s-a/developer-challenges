export function validateEmail (value: string) {
  if (!/\S+@\S+\.\S+/.test(value)) {
    return ({
      alreadyFilled: true,
      visible: true,
      message: 'Por favor, insira um e-mail válido!'
    })
  } else {
    return ({
      alreadyFilled: true,
      visible: false,
      message: ''
    })
  }
}

export function validatePassword (value: string) {
  if (value.length < 6) {
    return ({
      alreadyFilled: true,
      visible: true,
      message: 'Por favor, insira uma senha com no mínimo 6 caracteres!'
    })
  } 
  return ({
    alreadyFilled: true,
    visible: false,
    message: ''
  })
}