import {expect, describe, it, beforeEach} from 'vitest';
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/in-memory-check-ins-repository';
import {FetchUserCheckInsHistoryUseCase} from '@/use-cases/fetch-user-check-ins-history';

describe('Fetch user check-in history Use Case', () => {
  let checkInsRepository : InMemoryCheckInsRepository;
  let fetchUserCheckInHistoryUseCase: FetchUserCheckInsHistoryUseCase;

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    fetchUserCheckInHistoryUseCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
  });

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    });

    const { checkIns } = await fetchUserCheckInHistoryUseCase.execute({
      userId: 'user-01',
      page: 1
    });

    expect(checkIns.length).toBe(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ]);
  });

  it('should be able to fetch paginated check-in history', async () => {
    for(let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      });
    }

    const { checkIns } = await fetchUserCheckInHistoryUseCase.execute({
      userId: 'user-01',
      page: 2
    });

    expect(checkIns.length).toBe(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ]);
  });
});