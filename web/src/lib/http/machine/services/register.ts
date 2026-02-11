import type { MachineDTO } from '@/lib/database/machine/schema'

async function registerMachinePost(dto: MachineDTO) {
  const response = await fetch('/api/machine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  })

  const responseJson = await response.json()
  console.log(responseJson)
  const validatedValue = loginResponseSchema.parse(responseJson)
  return validatedValue
}
