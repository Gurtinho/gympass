import { CheckIn } from "@prisma/client";

import { CheckinsRepository } from "@/repositories/checkins-repository";

interface FetchUserCheckinServiceRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckinServiceResponse {
  checkins: CheckIn[];
}

export class FetchUserCheckinService {
  constructor(
    private checkinsRepository: CheckinsRepository,
  ) {}

  async execute({ userId, page }: FetchUserCheckinServiceRequest): Promise<FetchUserCheckinServiceResponse> {
    const checkins = await this.checkinsRepository.findManyByuserId(userId, page);

    return {
      checkins,
    };
  }
}