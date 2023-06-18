import {expect, describe, it, beforeEach} from 'vitest';
import {InMemoryGymsRepository} from '@/repositories/in-memory/in-memory-gyms-repository';
import {FetchNearbyGymsUseCase} from '@/use-cases/fetch-nearby-gyms';

describe('Fetch Nearby Gyms Use Case', () => {
  let gymsRepository : InMemoryGymsRepository;
  let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -7.0975286,
      longitude: -34.8465505,
      phone: null,
      description: null
    });

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -7.0004418,
      longitude: -34.8316639,
      phone: null,
      description: null
    });

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -7.0959609,
      userLongitude: -34.8380438
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym'
      })
    ]);
  });
});