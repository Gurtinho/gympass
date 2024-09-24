import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory-gyms-repository";
import { FetchNearbyGymsService } from "./fetchNearbyGymsService";

let gymsRepository: InMemoryGymsRepository;
let fetchNearbyGymsService: FetchNearbyGymsService;

describe("Fetch Nearby Gyms", () => {
  beforeEach( async () => {
    gymsRepository = new InMemoryGymsRepository();
    fetchNearbyGymsService = new FetchNearbyGymsService(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: 'Near gym',
      description: null,
      phone: null,
      latitude: -26.2575278,
      longitude: -53.6350672
    });

    await gymsRepository.create({
      title: 'Far gym',
      description: null,
      phone: null,
      latitude: -26.2972678,
      longitude: -53.5417412
    });

    const { gyms } = await fetchNearbyGymsService.execute({
      userLatitude: -26.2575278,
      userLongitude: -53.6350672
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near gym' }),
    ]);
  });
});