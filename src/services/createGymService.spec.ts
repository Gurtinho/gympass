import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory-gyms-repository";
import { CreateGymService } from "./createGymService";

let gymsRepository: InMemoryGymsRepository;
let createGymService: CreateGymService;

describe("Create Gyms", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    createGymService = new CreateGymService(gymsRepository);
  });

  it("should be able to create new gym", async () => {
    const { gym } = await createGymService.execute({
      title: 'Javascript gym',
      description: null,
      phone: null,
      latitude: -26.2575278,
      longitude: -53.6350672
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});