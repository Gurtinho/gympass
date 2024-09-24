import { CheckIn } from "@prisma/client";

import { CheckinsRepository } from "@/repositories/checkins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resourceNotFoundError";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxNumbersOfCheckinsError } from "./errors/maxNumbersOfChekinsError";
import { MaxDistanceError } from "./errors/maxDistanceError";

interface CheckinServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckinServiceResponse {
  checkin: CheckIn;
}

export class CheckinService {
  constructor(
    private checkinsRepository: CheckinsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({ gymId, userId, userLatitude, userLongitude }: CheckinServiceRequest): Promise<CheckinServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    // Calcular a distância entre usuário e academia
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber()
      }
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkinOnSameDay = await this.checkinsRepository.findByUserIdOnDate(userId, new Date());

    if (checkinOnSameDay) {
      throw new MaxNumbersOfCheckinsError();
    }

    const checkin = await this.checkinsRepository.create({ user_id: userId, gym_id: gymId });

    return {
      checkin,
    };
  }
}