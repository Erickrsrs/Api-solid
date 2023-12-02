import fastify from 'fastify'
import { appRoutes } from './api/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

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
