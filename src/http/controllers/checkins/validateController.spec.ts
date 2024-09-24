import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Validate Checkin e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to validate a checkin", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

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

    let checkin = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      }
    });

    const gymsResponse = await request(app.server)
    .patch(`/checkins/${checkin.id}/validate`)
    .set('Authorization', `Bearer ${token}`)
    .send();

    expect(gymsResponse.statusCode).toEqual(204);
    
    checkin = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkin.id
      }
    });

    expect(checkin.validated_at).toEqual(expect.any(Date));
  });
});