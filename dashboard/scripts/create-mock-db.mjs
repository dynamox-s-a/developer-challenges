import { mkdir, readFile, writeFile } from 'node:fs/promises'

const source = new URL('../../response-challenge-v2.json', import.meta.url)
const targetDirectory = new URL('../.mock/', import.meta.url)
const target = new URL('./db.json', targetDirectory)
const data = JSON.parse(await readFile(source, 'utf8'))

await mkdir(targetDirectory, { recursive: true })
await writeFile(target, JSON.stringify({ data }, null, 2))
