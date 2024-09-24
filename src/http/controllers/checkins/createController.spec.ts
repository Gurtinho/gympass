import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create Checkin e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to create a checkin", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const { id } = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        description: 'Some gym',
        phone: '991999999',
        latitude: -26.2575278,
        longitude: -53.6350672
      }
    });

    const gymsResponse = await request(app.server)
    .post(`/gyms/${id}/checkins`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      latitude: -26.2575278,
      longitude: -53.6350672
    });

    expect(gymsResponse.statusCode).toEqual(201);
  });
});