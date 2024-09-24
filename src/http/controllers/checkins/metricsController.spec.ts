import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Checkin metrics e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to get metrics count of checkins", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        description: 'Some gym',
        phone: '991999999',
        latitude: -26.2575278,
        longitude: -53.6350672
      }
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        }
      ]
    });

    const response = await request(app.server)
    .get(`/checkins/metrics`)
    .set('Authorization', `Bearer ${token}`)
    .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkinCount).toEqual(2);
  });
});