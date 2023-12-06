import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../repositories/check-ins-repository'

interface FetchUserCheckInServiceRequest {
  userId: string
  page: number
}

interface FetchUserCheckInServiceResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInServiceRequest): Promise<FetchUserCheckInServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
