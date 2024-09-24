import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryCheckinsRepository } from "@/repositories/in-memory-checkins-repository";
import { FetchUserCheckinService } from "./fetchUserCheckinsHistoryService";

let checkinsRepository: InMemoryCheckinsRepository;
let fetchUserCheckinService: FetchUserCheckinService;

describe("Fetch User Checkins History", () => {
  beforeEach( async () => {
    checkinsRepository = new InMemoryCheckinsRepository();
    fetchUserCheckinService = new FetchUserCheckinService(checkinsRepository);
  });

  it("should be able to fetch checkin history", async () => {
    await checkinsRepository.create({
      gym_id: 'gym01',
      user_id: 'user01',
    });

    await checkinsRepository.create({
      gym_id: 'gym02',
      user_id: 'user01',
    });

    const { checkins } = await fetchUserCheckinService.execute({
      userId: 'user01',
      page: 1
    });

    expect(checkins).toHaveLength(2);
    expect(checkins).toEqual([
      expect.objectContaining({ gym_id: 'gym01' }),
      expect.objectContaining({ gym_id: 'gym02' }),
    ]);
  });

  it("should be able to fetch paginated checkin history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkinsRepository.create({
        gym_id: `gym${i}`,
        user_id: 'user01',
      });
    }

    const { checkins } = await fetchUserCheckinService.execute({
      userId: 'user01',
      page: 2
    });

    expect(checkins).toHaveLength(2);
    expect(checkins).toEqual([
      expect.objectContaining({ gym_id: 'gym21' }),
      expect.objectContaining({ gym_id: 'gym22' }),
    ]);
  });
});