import {CheckInsRepository} from '@/repositories/check-ins-repository';
import {CheckIn, Prisma} from '@prisma/client';
import { randomUUID } from 'node:crypto';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  checkins: CheckIn[] = [];

  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.checkins.push(checkIn);

    return Promise.resolve(checkIn);
  }
}