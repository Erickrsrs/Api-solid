import fastify from 'fastify'
import { appRoutes } from './api/routes'

export const app = fastify()

app.register(appRoutes)
