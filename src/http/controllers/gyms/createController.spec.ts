import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const gymsResponse = await request(app.server)
    .post('/gyms/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Javascript gym',
      description: 'Some',
      phone: '991999999',
      latitude: -26.2575278,
      longitude: -53.6350672
    });

    expect(gymsResponse.statusCode).toEqual(201);
  });
});