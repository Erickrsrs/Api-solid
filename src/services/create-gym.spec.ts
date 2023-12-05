import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('create gym service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to register gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym 01',
      description: 'Gym 01 description',
      phone: '123456789',
      latitude: 32.9066035,
      longitude: 106.9526343,
    })

    expect(gym).toEqual(expect.any(Object))
  })
})
