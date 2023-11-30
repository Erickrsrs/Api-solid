import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8).max(100),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const user = await prisma.user.create({
    data: { name, email, password_hash: password },
  })

  return reply.status(201).send(user)
}
