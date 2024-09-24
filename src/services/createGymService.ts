import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

export interface CreateGymInterface {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymResponse {
  gym: Gym;
}

export class CreateGymService {
  constructor(private gymsRepository: GymsRepository) {}
  
  async execute({ title, description, phone, latitude, longitude }: CreateGymInterface): Promise<CreateGymResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude
    });

    return {
      gym
    };
  }
}