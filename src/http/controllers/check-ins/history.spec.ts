import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Check-in History (E2E)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to the check-ins history', async function () {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: 'JS Academy',
        latitude: 10,
        longitude: 10,
      }
    });

    await prisma.checkIn.createMany({
      data: [{
        gym_id: gym.id,
        user_id: user.id
      }, {
        gym_id: gym.id,
        user_id: user.id
      }]
    });

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send();
    
    expect(response.statusCode).toBe(200);
    expect(response.body.checkIns).toHaveLength(2);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id
      })
    ]);
  });
});