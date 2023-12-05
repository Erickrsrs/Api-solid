import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('check-in service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Gym 01',
      description: 'Gym 01 description',
      phone: '123456789',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn).toEqual(expect.any(Object))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2020-01-01T10:00:00'))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(async () => {
      await sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: 0,
        userLongitude: 0,
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn).toEqual(expect.any(Object))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Gym 01',
      description: 'Gym 01 description',
      phone: '123456789',
      latitude: new Decimal(32.9066035),
      longitude: new Decimal(106.9526343),
    })

    expect(async () => {
      await sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: 36.1782701,
        userLongitude: -106.6346319,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
