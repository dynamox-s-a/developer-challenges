import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET!
const expiresIn = '24h'

export function signAccessToken(payload: { userUuid: string }) {
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, secret) as {
    userUuid: string
    iat: number
    exp: number
  }
}
