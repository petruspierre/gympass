import {expect, describe, it, beforeEach} from 'vitest';
import {InMemoryGymsRepository} from '@/repositories/in-memory/in-memory-gyms-repository';
import {SearchGymUseCase} from '@/use-cases/search-gyms';

describe('Search gyms Use Case', () => {
  let gymsRepository : InMemoryGymsRepository;
  let searchGymsUseCase: SearchGymUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    searchGymsUseCase = new SearchGymUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JS Academy',
      latitude: 0,
      longitude: 0,
      phone: null,
      description: null
    });

    await gymsRepository.create({
      title: 'TS Academy',
      latitude: 0,
      longitude: 0,
      phone: null,
      description: null
    });

    const { gyms } = await searchGymsUseCase.execute({
      query: 'JS',
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JS Academy'
      })
    ]);
  });

  it('should be able to fetch paginatec gyms search', async () => {
    for (let i = 1; i<= 21; i++) {
      await gymsRepository.create({
        title: 'JS Academy ' + i,
        latitude: 0,
        longitude: 0,
        phone: null,
        description: null
      });
    }

    const { gyms } = await searchGymsUseCase.execute({
      query: 'JS',
      page: 2
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JS Academy 21'
      })
    ]);
  });
});