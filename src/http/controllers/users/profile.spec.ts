import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Profile (E2E)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get logged in user profile', async function () {
    const { token } = await createAndAuthenticateUser(app);

    const profileResponse = await request(app.server).get('/me').set('Authorization', `Bearer ${token}`).send();

    expect(profileResponse.statusCode).toBe(200);
    expect(profileResponse.body.user).toEqual(expect.objectContaining({
      email: 'johndoe@example.com'
    }));
  });
});