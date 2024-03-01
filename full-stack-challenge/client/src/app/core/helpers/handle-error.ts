type HandleErrorType = (
  error: any,
  options?: { defaultMessage?: string }
) => {
  code?: string;
  message?: string;
};

export const handleError: HandleErrorType = (error, options) => {
  if (
    error?.response?.data?.error?.includes('E_INVALID_AUTH_UID') ||
    error?.response?.data?.error?.includes('E_INVALID_AUTH_PASSWORD')
  ) {
    return {
      code: 'E_INVALID_CREDENTIALS',
      message: 'Nome de usuário ou senha incorretos',
    };
  }

  return {
    code: error?.code,
    message: error?.message || options?.defaultMessage || JSON.stringify(error),
  };
};
