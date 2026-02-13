import request from 'supertest'
import type { Express } from 'express'

let sequence = 0

function nextSequence() {
  sequence += 1
  return sequence
}

export async function createUserAndLogin(app: Express) {
  const id = nextSequence()
  const email = `test.user.${id}@example.com`
  const password = 'Password123'
  const name = `Test User ${id}`

  const registerResponse = await request(app).post('/api/auth/register').send({
    email,
    password,
    name
  })

  if (registerResponse.status !== 201) {
    throw new Error(
      `register failed: ${registerResponse.status} ${JSON.stringify(registerResponse.body)}`
    )
  }

  const loginResponse = await request(app).post('/api/auth/login').send({
    email,
    password
  })

  if (loginResponse.status !== 200) {
    throw new Error(
      `login failed: ${loginResponse.status} ${JSON.stringify(loginResponse.body)}`
    )
  }

  return {
    token: loginResponse.body.data.token as string,
    user: loginResponse.body.data.user as {
      uuid: string
      name: string
      email: string
    }
  }
}

export async function createMachine(app: Express, token: string, input?: {
  name?: string
  type?: 'Pump' | 'Fan'
}) {
  const id = nextSequence()
  const payload = {
    name: input?.name ?? `Machine ${id}`,
    type: input?.type ?? 'Fan'
  }

  const response = await request(app)
    .post('/api/machines')
    .set('Authorization', `Bearer ${token}`)
    .send(payload)

  if (response.status !== 201) {
    throw new Error(
      `create machine failed: ${response.status} ${JSON.stringify(response.body)}`
    )
  }

  return response.body.data as {
    uuid: string
    name: string
    type: 'Pump' | 'Fan'
  }
}

export async function createMonitoringPoint(
  app: Express,
  token: string,
  machineUuid: string,
  input?: { name?: string }
) {
  const id = nextSequence()
  const payload = {
    name: input?.name ?? `MP ${id}`,
    machineUuid
  }

  const response = await request(app)
    .post('/api/monitoring-points')
    .set('Authorization', `Bearer ${token}`)
    .send(payload)

  if (response.status !== 201) {
    throw new Error(
      `create monitoring point failed: ${response.status} ${JSON.stringify(response.body)}`
    )
  }

  return response.body.data as {
    uuid: string
    name: string
  }
}

export async function createSensor(
  app: Express,
  token: string,
  monitoringPointUuid: string,
  input?: {
    sensorUniqueId?: string
    model?: 'TcAg' | 'TcAs' | 'HF_PLUS'
  }
) {
  const id = nextSequence()
  const sensorUniqueId = input?.sensorUniqueId ?? `SENSOR-${String(id).padStart(3, '0')}`

  const payload = {
    sensorUniqueId,
    model: input?.model ?? 'TcAg',
    monitoringPointUuid
  }

  const response = await request(app)
    .post('/api/sensors')
    .set('Authorization', `Bearer ${token}`)
    .send(payload)

  if (response.status !== 201) {
    throw new Error(
      `create sensor failed: ${response.status} ${JSON.stringify(response.body)}`
    )
  }

  return response.body.data as {
    uuid: string
    sensorUniqueId: string
    model: 'TcAg' | 'TcAs' | 'HF_PLUS'
  }
}
