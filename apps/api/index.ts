import {fastify} from 'fastify'
import {serializerCompiler, validatorCompiler} from 'fastify-type-provider-zod'

const server = fastify({logger: true})

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})