import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gyms (E2E)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms', async function () {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JS Academy',
        description: 'The best gym in the world',
        phone: '123456789',
        latitude: 10,
        longitude: 10
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TS Academy',
        description: 'The *actual* best gym in the world',
        phone: '123456789',
        latitude: 10.001,
        longitude: 10.002
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'JS'
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms[0]).toEqual(expect.objectContaining({
      title: 'JS Academy'
    }));
  });
});