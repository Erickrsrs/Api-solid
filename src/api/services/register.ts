import { hash } from 'bcryptjs'
import { UsersRepository } from '../repositories/users-repository'

interface IRegisterService {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: IRegisterService) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('User with this email already exists')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
