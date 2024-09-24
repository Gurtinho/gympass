import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory-gyms-repository";
import { SearchGymsService } from "./searchGymsService";

let gymsRepository: InMemoryGymsRepository;
let searchGymsService: SearchGymsService;

describe("Fetch User Checkins History", () => {
  beforeEach( async () => {
    gymsRepository = new InMemoryGymsRepository();
    searchGymsService = new SearchGymsService(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: 'Javascript gym',
      description: null,
      phone: null,
      latitude: -26.2575278,
      longitude: -53.6350672
    });

    await gymsRepository.create({
      title: 'Typescript gym',
      description: null,
      phone: null,
      latitude: -26.2575278,
      longitude: -53.6350672
    });

    const { gyms } = await searchGymsService.execute({
      query: 'Typescript',
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript gym' }),
    ]);
  });


  it("should be able to fetch paginated when gyms searched", async () => {
    for (let i = 1; i <= 22; i++) { // criar várias academias
      await gymsRepository.create({
        title: `Javascript gym ${i}`,
        description: null,
        phone: null,
        latitude: -26.2575278,
        longitude: -53.6350672
      });
    }

    const { gyms } = await searchGymsService.execute({
      query: 'Javascript gym',
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript gym 21' }),
      expect.objectContaining({ title: 'Javascript gym 22' }),
    ]);
  });
});