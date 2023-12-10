import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'
import { ZodError } from 'zod'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error)
  } // TODO: Here we can send the error to a logger service

  return reply.status(500).send({ message: 'Internal server error' })
})
