import {PrismaGymsRepository} from '@/repositories/prisma/prisma-gyms-repository';
import {SearchGymUseCase} from '@/use-cases/search-gyms';

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new SearchGymUseCase(gymsRepository);

  return useCase;
}