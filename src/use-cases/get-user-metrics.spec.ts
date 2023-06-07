import {expect, describe, it, beforeEach} from 'vitest';
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/in-memory-check-ins-repository';
import {GetUserMetricsUseCase} from '@/use-cases/get-user-metrics';

describe('Get user metrics Use Case', () => {
  let checkInsRepository : InMemoryCheckInsRepository;
  let getUserMetricsUseCase: GetUserMetricsUseCase;

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    });

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toBe(2);
  });
});