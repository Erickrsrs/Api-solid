import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('register service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'jons@email.com',
      password: '123456',
    })

    expect(user).toEqual(expect.any(Object))
  })

  it('should be able to hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'jons@email.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('should be able to not allow two users with the same email', async () => {
    const email = 'jons@email.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
