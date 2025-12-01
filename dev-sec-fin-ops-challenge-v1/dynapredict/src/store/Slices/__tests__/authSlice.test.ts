import { describe, it, expect } from 'vitest'
import authReducer, { loginStart, loginSuccess, loginFailure, logout } from '../authSlice'

describe('authSlice', () => {
  const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
  }

  it('should handle loginStart', () => {
    const action = loginStart()
    const state = authReducer(initialState, action)
    expect(state.loading).toBe(true)
  })

  it('should handle loginSuccess', () => {
    const user = { email: 'test@example.com' }
    const action = loginSuccess(user)
    const state = authReducer(initialState, action)
    
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(user)
    expect(state.loading).toBe(false)
  })

  it('should handle loginFailure', () => {
    const loadingState = { ...initialState, loading: true }
    const action = loginFailure()
    const state = authReducer(loadingState, action)
    
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBe(null)
    expect(state.loading).toBe(false)
  })

  it('should handle logout', () => {
    const authenticatedState = {
      isAuthenticated: true,
      user: { email: 'test@example.com' },
      loading: false,
    }
    const action = logout()
    const state = authReducer(authenticatedState, action)
    
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBe(null)
  })
})