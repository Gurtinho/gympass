import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gyms e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to search a gym", async () => {
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
      latitude: -26.2575278,
      longitude: -53.6350672
    });

    const response = await request(app.server)
    .get('/gyms/search')
    .query({ query: 'Javascript' })
    .set('Authorization', `Bearer ${token}`)


    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript gym'
      })
    ]);
  });
});