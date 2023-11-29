import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

prisma.user.create({ data: { name: 'Alice', email: 'alice@email.com' } })

export const app = fastify()
