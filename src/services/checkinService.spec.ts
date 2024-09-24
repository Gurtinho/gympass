import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { CheckinService } from "./chekinService";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory-checkins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumbersOfCheckinsError } from "./errors/maxNumbersOfChekinsError";
import { MaxDistanceError } from "./errors/maxDistanceError";

let checkinsRepository: InMemoryCheckinsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkinService: CheckinService;

describe("Create Checkins", () => {
  beforeEach( async () => {
    checkinsRepository = new InMemoryCheckinsRepository();
    gymsRepository = new InMemoryGymsRepository();
    checkinService = new CheckinService(
      checkinsRepository,
      gymsRepository
    );

    // Salvar uma academia
    await gymsRepository.create({
      id: 'gym01',
      description: 'Academia TS',
      phone: '999999999',
      title: 'eeeeeeee',
      latitude: -26.2575278,
      longitude: -53.6350672
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers(); // Resetar as datas para não causar problemas
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2023, 2, 21, 8, 0, 0)); // Mock para usar o mesmo dia

    const { checkin } = await checkinService.execute({
      gymId: 'gym01',
      userId: 'user01',
      userLatitude: -26.2575278,
      userLongitude: -53.6350672
    });

    expect(checkin.id).toEqual(expect.any(String));
  });

  it("should not be able to checkin twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 2, 21, 8, 0, 0)); // Mock para usar o mesmo dia

    await checkinService.execute({
      gymId: 'gym01',
      userId: 'user01',
      userLatitude: -26.2575278,
      userLongitude: -53.6350672
    });

    await expect(() => {
      return checkinService.execute({
        gymId: 'gym01',
        userId: 'user01',
        userLatitude: -26.2575278,
        userLongitude: -53.6350672
      });
    }).rejects.toBeInstanceOf(MaxNumbersOfCheckinsError);
  });

  it("should be able to checkin twice in the different days", async () => {
    vi.setSystemTime(new Date(2023, 2, 21, 8, 0, 0)); // Seta um dia

    await checkinService.execute({
      gymId: 'gym01',
      userId: 'user01',
      userLatitude: -26.2575278,
      userLongitude: -53.6350672
    });

    vi.setSystemTime(new Date(2023, 2, 22, 8, 0, 0)); // Checkin em dia diferente

    const { checkin } = await checkinService.execute({
      gymId: 'gym01',
      userId: 'user01',
      userLatitude: -26.2575278,
      userLongitude: -53.6350672
    });

    expect(checkin.id).toEqual(expect.any(String));
  });

  it("should not be able to checkin on distant gym", async () => {
    gymsRepository.gyms.push({
      id: 'gym02',
      description: 'Academia TS',
      phone: '999999999',
      title: 'eeeeeeee',
      latitude: new Decimal(-26.2972678),
      longitude: new Decimal(-53.5417412)
    });

    await expect(() => checkinService.execute({
      gymId: 'gym02',
      userId: 'user01',
      userLatitude: -26.2575278,
      userLongitude: -53.6350672
    })).rejects.toBeInstanceOf(MaxDistanceError);
  });
});