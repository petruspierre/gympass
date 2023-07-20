import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms (E2E)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search near gyms', async function () {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Gym',
        latitude: -7.0975286,
        longitude: -34.8465505,
        phone: null,
        description: null
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far Gym',
        latitude: -7.0004418,
        longitude: -34.8316639,
        phone: null,
        description: null
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -7.0959609,
        longitude: -34.8380438
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms[0]).toEqual(expect.objectContaining({
      title: 'Near Gym'
    }));
  });
});