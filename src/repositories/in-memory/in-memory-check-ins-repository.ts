import {CheckInsRepository} from '@/repositories/check-ins-repository';
import {CheckIn, Prisma} from '@prisma/client';
import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  checkins: CheckIn[] = [];

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkins.find(checkIn => checkIn.id === id);

    return Promise.resolve(checkIn || null);
  }

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

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const index = this.checkins.findIndex(checkIn => checkIn.id === checkIn.id);

    if(index >= 0) {
      this.checkins[index] = checkIn;
    }

    return Promise.resolve(checkIn);
  }

  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkIn = this.checkins.find(checkIn => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    return Promise.resolve(checkIn || null);
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.checkins.filter(checkIn => checkIn.user_id === userId).slice((page - 1) * 20, page * 20);

    return Promise.resolve(checkIns);
  }

  async countByUserId(userId: string): Promise<number> {
    const checkIns = this.checkins.filter(checkIn => checkIn.user_id === userId);

    return Promise.resolve(checkIns.length);
  }
}