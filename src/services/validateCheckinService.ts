import { CheckIn } from "@prisma/client";

import { CheckinsRepository } from "@/repositories/checkins-repository";
import { ResourceNotFoundError } from "./errors/resourceNotFoundError";
import dayjs from "dayjs";
import { LateCheckinValidationError } from "./errors/lateCheckinValidationError";

interface ValidateCheckinServiceRequest {
  checkinId: string;
}

interface ValidateCheckinServiceResponse {
  checkin: CheckIn;
}

export class ValidateCheckinService {
  constructor(
    private checkinsRepository: CheckinsRepository,
  ) {}

  async execute({ checkinId }: ValidateCheckinServiceRequest): Promise<ValidateCheckinServiceResponse> {
    const checkin = await this.checkinsRepository.findById(checkinId);

    if (!checkin) throw new ResourceNotFoundError();

    const distanceInMinutesFromCheckinCreation = dayjs(new Date()).diff(checkin.created_at, 'minutes');
    if (distanceInMinutesFromCheckinCreation > 20) {
      throw new LateCheckinValidationError();
    }

    // Salvar data atual
    checkin.validated_at = new Date();

    await this.checkinsRepository.save(checkin);

    return {
      checkin,
    };
  }
}