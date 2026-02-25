export const decodeFakeJwtToken = (token: string) => {
  const payload = token.split('.')[1];
  const decodedPayload = JSON.parse(atob(payload));
  return decodedPayload;
};

export const saveToken = (token: string) => {
  localStorage.setItem('token', token);
  document.cookie = `token=${token}; path=/`;
};

export const clearToken = () => {
  localStorage.removeItem('token');
  document.cookie = 'token=; path=/;';
};
