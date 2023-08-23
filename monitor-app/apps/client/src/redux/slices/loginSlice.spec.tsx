import { loginSlice, setUser } from './loginSlice'

describe('loginSlice', () => {
  test('should return new login state', () => {
    const state = {}
    const action = {
      type: 'login/setUser',
      payload: {
        user: {
          name: 'John Doe',
          email: 'email@example.com'
        }
      }
    }

    const newState = loginSlice.reducer(state, setUser(action.payload))
    expect(newState).toEqual(action.payload)
  })
})
