import {expect, describe, it, beforeEach} from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import {AuthenticateUseCase} from '@/use-cases/authenticate';
import {hash} from 'bcryptjs';
import {InvalidCredentialsError} from '@/use-cases/errors/invalid-credentials-error';

describe('Authenticate Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let authenticateUseCase: AuthenticateUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    });

    const { user } = await authenticateUseCase.execute({
      email: 'johndoe@example.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    expect(() =>
      authenticateUseCase.execute({
        email: 'nonexistent@example.com',
        password: '123123',
      })
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    });

    expect(() =>
      authenticateUseCase.execute({
        email: 'johndoe@example.com',
        password: '123123',
      })
    ).rejects.toThrow(InvalidCredentialsError);
  });
});