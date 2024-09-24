import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gyms e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to list nearby gym", async () => {
    // precisa estar autenticado com usuario admin
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
    .post('/gyms/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Javascript gym',
      description: 'Some',
      phone: '991999999',
      latitude: -26.2575278,
      longitude: -53.6350672
    });

    await request(app.server)
    .post('/gyms/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Typescript gym',
      description: 'Some',
      phone: '991999999',
      latitude: -26.2972678,
      longitude: -53.5417412
    });

    const response = await request(app.server)
    .get('/gyms/nearby')
    .set('Authorization', `Bearer ${token}`)
    .query({
      latitude: -26.2575278,
      longitude: -53.6350672
    })

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript gym'
      })
    ]);
  });
});