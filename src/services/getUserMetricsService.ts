import { CheckinsRepository } from "@/repositories/checkins-repository";

interface GetUserMetricsServiceRequest {
  userId: string;
}

interface GetUserMetricsServiceResponse {
  checkinCount: number;
}

export class GetUserMetricsService {
  constructor(
    private checkinsRepository: CheckinsRepository,
  ) {}

  async execute({ userId }: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceResponse> {
    const checkinCount = await this.checkinsRepository.countByUserId(userId);

    return {
      checkinCount,
    };
  }
}