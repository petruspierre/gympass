import {PrismaCheckInsRepository} from '@/repositories/prisma/prisma-check-ins-repository';
import {CheckInUseCase} from '@/use-cases/check-in';
import {PrismaGymsRepository} from '@/repositories/prisma/prisma-gyms-repository';

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CheckInUseCase(gymsRepository, checkInsRepository);

  return useCase;
}