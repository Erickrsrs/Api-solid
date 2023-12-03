import { expect, it, describe } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

describe('register service', () => {
  it('should be able to register a new user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterService(usersRepository)

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'jons@email.com',
      password: '123456',
    })

    expect(user).toMatchObject({
      id: expect.any(String),
      name: 'John Doe',
      email: expect.any(String),
      password_hash: expect.any(String),
      created_at: expect.any(Date),
    })
  })

  it('should be able to hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterService(usersRepository)

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'jons@email.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('should be able to not allow two users with the same email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterService(usersRepository)

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
