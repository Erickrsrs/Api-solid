import { hash } from 'bcryptjs'
import { prisma } from '../../lib/prisma'
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'

interface RegisterService {
  name: string
  email: string
  password: string
}

export async function registerService({
  name,
  email,
  password,
}: RegisterService) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWithSameEmail) {
    throw new Error('User with this email already exists')
  }

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
