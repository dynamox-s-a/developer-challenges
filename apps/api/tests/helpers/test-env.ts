import path from 'node:path'
import dotenv from 'dotenv'

const envPath = path.resolve(process.cwd(), '../../.env.test')
dotenv.config({ path: envPath, override: true })

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test_secret'
