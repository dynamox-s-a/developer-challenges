const generateFakeJwtToken = (user: { email: string; role: string }) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub: user.email,
    role: user.role,
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(JSON.stringify(header) + JSON.stringify(payload));

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const loginUser = async (email: string, password: string) => {
  //EM uma API real, eu faria uma request do tipo POST e provavelmente usaria um authentication service.
  const response = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
  const data = await response.json();
  if (!data.length) {
    throw new Error('Credenciais inválidas');
  }
  const token = generateFakeJwtToken(data[0]);
  return { user: { email: data[0].email, role: data[0].role }, token };
};
