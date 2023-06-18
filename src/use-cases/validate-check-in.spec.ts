import {expect, describe, it, beforeEach, vi, afterEach} from 'vitest';
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/in-memory-check-ins-repository';
import {ValidateCheckInUseCase} from '@/use-cases/validate-check-in';
import {ResourceNotFoundError} from '@/use-cases/errors/resource-not-found-error';
import {LateCheckInValidationError} from '@/use-cases/errors/late-check-in-validation-error';

describe('Validate Checkin Use Case', () => {
  let checkInsRepository : InMemoryCheckInsRepository;
  let validateCheckInUseCase: ValidateCheckInUseCase;

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check-in', async () => {
    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id'
    });

    const response = await validateCheckInUseCase.execute({
      checkInId: checkIn.id
    });

    expect(response.checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.checkins[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: 'foo'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id'
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: checkIn.id
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});