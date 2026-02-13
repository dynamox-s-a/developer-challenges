import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { dbDisconnect, dbReset } from '../helpers/db'
import { makeTestApp } from '../helpers/makeTestApp'

describe.sequential('Auth API integration', () => {
  const app = makeTestApp()

  beforeEach(async () => {
    await dbReset()
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it('registers, logs in and retrieves current user', async () => {
    const register = await request(app).post('/api/auth/register').send({
      email: 'auth.user@example.com',
      password: 'Password123',
      name: 'Auth User'
    })

    expect(register.status).toBe(201)
    expect(register.body.success).toBe(true)
    expect(register.body.data.user.email).toBe('auth.user@example.com')

    const login = await request(app).post('/api/auth/login').send({
      email: 'auth.user@example.com',
      password: 'Password123'
    })

    expect(login.status).toBe(200)
    expect(login.body.success).toBe(true)
    expect(login.body.data.token).toEqual(expect.any(String))

    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.data.token}`)

    expect(me.status).toBe(200)
    expect(me.body.success).toBe(true)
    expect(me.body.data.email).toBe('auth.user@example.com')
  })

  it('returns proper errors for duplicate register, invalid login and missing token', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'duplicate.user@example.com',
      password: 'Password123',
      name: 'Dup'
    })

    const duplicate = await request(app).post('/api/auth/register').send({
      email: 'duplicate.user@example.com',
      password: 'Password123',
      name: 'Dup 2'
    })

    expect(duplicate.status).toBe(409)
    expect(duplicate.body.success).toBe(false)

    const invalidLogin = await request(app).post('/api/auth/login').send({
      email: 'duplicate.user@example.com',
      password: 'WrongPassword'
    })

    expect(invalidLogin.status).toBe(401)
    expect(invalidLogin.body.success).toBe(false)

    const meWithoutToken = await request(app).get('/api/auth/me')

    expect(meWithoutToken.status).toBe(401)
    expect(meWithoutToken.body.success).toBe(false)
  })
})
