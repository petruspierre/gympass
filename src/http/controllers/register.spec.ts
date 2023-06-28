import request from 'supertest';
import { app } from '@/app';
import {beforeAll, describe, expect, it} from 'vitest';

describe('Register (E2E)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  it('should be able to register', async function () {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    expect(response.statusCode).toBe(201);
  });
});