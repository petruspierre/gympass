import {expect, describe, it, beforeEach} from 'vitest';
import {InMemoryGymsRepository} from '@/repositories/in-memory/in-memory-gyms-repository';
import {CreateGymUseCase} from '@/use-cases/create-gym';

describe('Register Use Case', () => {
  let gymsRepository : InMemoryGymsRepository;
  let createGymUseCase: CreateGymUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    createGymUseCase = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to register', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Gym',
      latitude: 0,
      longitude: 0,
      phone: null,
      description: null
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});