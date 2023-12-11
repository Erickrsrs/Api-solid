import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyGymsService } from '../../../services/factories/make-fetch-nearby-gyms-service'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  const fetchNearbyGyms = makeFetchNearbyGymsService()

  const { gyms } = await fetchNearbyGyms.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send({
    gyms,
  })
}