import {expect, describe, it, beforeEach, vi, afterEach} from 'vitest';
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/in-memory-check-ins-repository';
import {CheckInUseCase} from '@/use-cases/check-in';

describe('Checkin Use Case', () => {
  let checkInsRepository : InMemoryCheckInsRepository;
  let checkInUseCase: CheckInUseCase;

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    checkInUseCase = new CheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 3, 8, 12, 0, 0));

    await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    });

    await expect(() => checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    })).rejects.toThrow(Error);
  });

  it('should be able to checkin in different days', async () => {
    vi.setSystemTime(new Date(2023, 3, 8, 12, 0, 0));

    await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    });

    vi.setSystemTime(new Date(2023, 3, 9, 12, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});