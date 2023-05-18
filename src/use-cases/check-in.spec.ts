import {expect, describe, it, beforeEach} from 'vitest';
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/in-memory-check-ins-repository';
import {CheckInUseCase} from '@/use-cases/check-in';

describe('Checkin Use Case', () => {
  let checkInsRepository : InMemoryCheckInsRepository;
  let checkInUseCase: CheckInUseCase;

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    checkInUseCase = new CheckInUseCase(checkInsRepository);
  });

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});