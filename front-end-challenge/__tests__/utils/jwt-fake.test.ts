import {
  generateFakeJWT,
  decodeFakeJWT,
  isValidFakeJWT
} from '@/lib/auth/jwt-fake'
import { UserRole } from '@/types/auth'

describe('JWT Fake Utils', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.ADMIN
  }

  describe('generateFakeJWT', () => {
    it('should generate a JWT with correct format', () => {
      const token = generateFakeJWT(mockUser)
      
      // JWT tem 3 partes separadas por ponto
      const parts = token.split('.')
      expect(parts).toHaveLength(3)
      
      // Cada parte deve ser base64
      parts.forEach(part => {
        expect(() => atob(part)).not.toThrow()
      })
    })

    it('should include user data in payload', () => {
      const token = generateFakeJWT(mockUser)
      const payload = decodeFakeJWT(token)
      
      expect(payload).toMatchObject({
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role
      })
      expect(payload?.userId).toBeDefined()
      expect(payload?.iat).toBeDefined()
      expect(payload?.exp).toBeDefined()
    })

    it('should generate different tokens for different users', () => {
      const user1 = { email: 'user1@test.com', role: UserRole.ADMIN }
      const user2 = { email: 'user2@test.com', role: UserRole.READER }
      
      const token1 = generateFakeJWT(user1)
      const token2 = generateFakeJWT(user2)
      
      expect(token1).not.toBe(token2)
    })
  })

  describe('decodeFakeJWT', () => {
    it('should decode valid JWT correctly', () => {
      const token = generateFakeJWT(mockUser)
      const payload = decodeFakeJWT(token)
      
      expect(payload).not.toBeNull()
      expect(payload?.email).toBe(mockUser.email)
      expect(payload?.role).toBe(mockUser.role)
    })

    it('should return null for invalid JWT format', () => {
      const invalidTokens = [
        'invalid',
        'invalid.token',
        'invalid.token.format.extra',
        '',
        'a.b.c' // válido formato mas conteúdo inválido
      ]
      
      invalidTokens.forEach(token => {
        const payload = decodeFakeJWT(token)
        expect(payload).toBeNull()
      })
    })

    it('should handle expired tokens', () => {
      // Mock Date.now para simular token expirado
      const originalNow = Date.now
      Date.now = jest.fn(() => new Date('2025-01-01').getTime())
      
      const token = generateFakeJWT(mockUser)
      
      // Avança o tempo para expirar o token
      Date.now = jest.fn(() => new Date('2025-01-03').getTime())
      
      const payload = decodeFakeJWT(token)
      expect(payload).toBeNull()
      
      // Restaura Date.now
      Date.now = originalNow
    })
  })

  describe('isValidFakeJWT', () => {
    it('should return true for valid tokens', () => {
      const token = generateFakeJWT(mockUser)
      expect(isValidFakeJWT(token)).toBe(true)
    })

    it('should return false for invalid tokens', () => {
      expect(isValidFakeJWT('invalid')).toBe(false)
      expect(isValidFakeJWT('')).toBe(false)
      expect(isValidFakeJWT('a.b.c')).toBe(false)
    })
  })
})