import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryCheckinsRepository } from "@/repositories/in-memory-checkins-repository";
import { GetUserMetricsService } from "./getUserMetricsService";

let checkinsRepository: InMemoryCheckinsRepository;
let getUserMetricsService: GetUserMetricsService;

describe("Get User Metrics", () => {
  beforeEach( async () => {
    checkinsRepository = new InMemoryCheckinsRepository();
    getUserMetricsService = new GetUserMetricsService(checkinsRepository);
  });

  it("should be able to get checkins count from metrics", async () => {
    await checkinsRepository.create({
      gym_id: 'gym01',
      user_id: 'user01',
    });

    await checkinsRepository.create({
      gym_id: 'gym02',
      user_id: 'user01',
    });

    const { checkinCount } = await getUserMetricsService.execute({
      userId: 'user01',
    });

    expect(checkinCount).toEqual(2);
  });
});