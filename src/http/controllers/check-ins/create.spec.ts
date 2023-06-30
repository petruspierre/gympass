import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create Check-in (E2E)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async function () {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'JS Academy',
        latitude: 10,
        longitude: 10,
      }
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: 10,
        longitude: 10,
      });
    
    expect(response.statusCode).toBe(201);
  });
});