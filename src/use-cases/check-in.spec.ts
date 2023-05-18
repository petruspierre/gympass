import {expect, describe, it, beforeEach, vi, afterEach} from 'vitest';
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/in-memory-check-ins-repository';
import {CheckInUseCase} from '@/use-cases/check-in';
import {InMemoryGymsRepository} from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime';
import {MaxDistanceError} from '@/use-cases/errors/max-distance-error';
import {MaxNumberOfCheckInsError} from '@/use-cases/errors/max-number-of-check-ins-error';

describe('Checkin Use Case', () => {
  let checkInsRepository : InMemoryCheckInsRepository;
  let gymsRepository: InMemoryGymsRepository;
  let checkInUseCase: CheckInUseCase;

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    checkInUseCase = new CheckInUseCase(gymsRepository, checkInsRepository);

    gymsRepository.create({
      id: 'gym-id',
      title: 'Gym',
      description: '',
      latitude: 0,
      longitude: 0,
      phone: '',
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 3, 8, 12, 0, 0));

    await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    });

    await expect(() => checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toThrow(MaxNumberOfCheckInsError);
  });

  it('should be able to checkin in different days', async () => {
    vi.setSystemTime(new Date(2023, 3, 8, 12, 0, 0));

    await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    });

    vi.setSystemTime(new Date(2023, 3, 9, 12, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.create({
      id: 'gym-id-2',
      title: 'Gym',
      description: '',
      latitude: 1,
      longitude: 1,
      phone: '',
    });

    expect(() => checkInUseCase.execute({
      gymId: 'gym-id-2',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toThrow(MaxDistanceError);
  });
});