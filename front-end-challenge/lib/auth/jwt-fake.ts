/**
 * Utilitários para gerar e validar JWT fake para desenvolvimento
 */

interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "reader";
  iat: number; // issued at
  exp: number; // expires at
}

/**
 * Gera um JWT fake para desenvolvimento
 * @param user - Dados do usuário para incluir no payload
 * @returns Token JWT fake
 */
export function generateFakeJWT(user: {
  email: string;
  name?: string;
  role: "admin" | "reader";
}): string {
  const now = Math.floor(Date.now() / 1000);

  const payload: JWTPayload = {
    userId: generateUserId(user.email),
    email: user.email,
    name: user.name || user.email.split("@")[0],
    role: user.role,
    iat: now,
    exp: now + 24 * 60 * 60, // Expira em 24 horas
  };

  // Simula a estrutura de um JWT: header.payload.signature
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadBase64 = btoa(JSON.stringify(payload));
  const signature = generateFakeSignature(header + "." + payloadBase64);

  return `${header}.${payloadBase64}.${signature}`;
}

/**
 * Decodifica um JWT fake e retorna o payload
 * @param token - Token JWT fake
 * @returns Payload decodificado ou null se inválido
 */
export function decodeFakeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));

    // Verifica se o token expirou
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Erro ao decodificar JWT fake:", error);
    return null;
  }
}

/**
 * Verifica se um JWT fake é válido
 * @param token - Token JWT fake
 * @returns true se válido, false caso contrário
 */
export function isValidFakeJWT(token: string): boolean {
  const payload = decodeFakeJWT(token);
  return payload !== null;
}

/**
 * Gera um ID único baseado no email
 */
function generateUserId(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Converte para 32bit integer
  }
  return Math.abs(hash).toString();
}

/**
 * Gera uma assinatura fake para o JWT
 */
function generateFakeSignature(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return btoa(Math.abs(hash).toString()).replace(/=/g, "");
}
