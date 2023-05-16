import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import {expect, describe, it, beforeEach} from 'vitest';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { hash } from 'bcryptjs';

describe('Get User Profile Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let getUserProfileUseCase: GetUserProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    });

    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id
    });

    expect(user.id).toEqual(createdUser.id);
  });

  it('should not be able to get non existent user', async () => {
    expect(() =>
      getUserProfileUseCase.execute({
        userId: 'not-found'
      })
    ).rejects.toThrow(ResourceNotFoundError);
  });
});