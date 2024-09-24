import { Gym, Prisma } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { FindManyNearbyParams, GymsRepository } from "./gyms-repository";
import { pagination } from "@/utils/paginations";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findById(gymId: string): Promise<Gym | null> {
    const gym = this.gyms.find(gym => gym.id === gymId);
    if (!gym) {
      return null;
    }
    return gym;
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const { id, title, description, phone, latitude, longitude } = data;
    const gym = {
      id: id ?? uuid(),
      title,
      description: description ?? null,
      phone: phone ?? null,
      latitude: new Prisma.Decimal(latitude.toString()),
      longitude: new Prisma.Decimal(longitude.toString())
    };
    this.gyms.push(gym);
    return gym;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return pagination(this.gyms.filter(item => item.title.includes(query)), page);
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.gyms.filter(item => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber()
        }
      );

      const DISTANCE_GYMS_LESS_TO_10KM = 10;
      return distance < DISTANCE_GYMS_LESS_TO_10KM
    });
  }
}