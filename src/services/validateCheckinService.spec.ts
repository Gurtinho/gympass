import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckinsRepository } from "@/repositories/in-memory-checkins-repository";
import { ValidateCheckinService } from "./validateCheckinService";
import { ResourceNotFoundError } from "./errors/resourceNotFoundError";

let checkinsRepository: InMemoryCheckinsRepository;
let validateCheckinService: ValidateCheckinService;

describe("Validate Checkins", () => {
  beforeEach( async () => {
    checkinsRepository = new InMemoryCheckinsRepository();
    validateCheckinService = new ValidateCheckinService(checkinsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers(); // Resetar as datas para não causar problemas
  });

  it("should be able to validate the check in", async () => {
    const createdCheckin = await checkinsRepository.create({
      gym_id: 'gym01',
      user_id: 'user01',
    });

    const { checkin } = await validateCheckinService.execute({
      checkinId: createdCheckin.id
    });

    expect(checkin.validated_at).toEqual(expect.any(Date));
    expect(checkinsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should be able to validate the inexistent check in", async () => {
    await expect(() =>
      validateCheckinService.execute({
        checkinId: 'inexistente-checkinId'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the checkin after 20 minutes of its created", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)); // setar um tempo fixo

    const createdCheckin = await checkinsRepository.create({
      gym_id: 'gym01',
      user_id: 'user01',
    });

    // adicionar 20 minutos a frente pra não permitir o checkin
    const MILLISECONDS_BY_21 = (1000 * 60) * 21;
    vi.advanceTimersByTime(MILLISECONDS_BY_21);

    await expect(() => 
      validateCheckinService.execute({
        checkinId: createdCheckin.id
      })
    ).rejects.toBeInstanceOf(Error);
  });
});