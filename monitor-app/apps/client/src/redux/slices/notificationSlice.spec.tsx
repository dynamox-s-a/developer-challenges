import notificationSlice, { notify } from './notificationSlice'

describe('notificationSlice', () => {
  test('should return a notification', () => {
    const state = { variant: '', message: '' }
    const action = {
      type: 'notification/notify',
      payload: { variant: 'success', message: `notification message` }
    }
    const newState = notificationSlice(state, notify(action.payload))
    expect(newState).toEqual(action.payload)
  })
})
