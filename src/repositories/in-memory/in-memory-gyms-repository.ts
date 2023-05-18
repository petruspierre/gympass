import { Gym, Prisma } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';
import {randomUUID} from 'node:crypto';

export class InMemoryGymsRepository implements GymsRepository {
  gyms: Gym[] = [];

  create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      description: data.description ?? null,
      phone: data.phone ?? null,
      created_at: new Date(),
    };

    this.gyms.push(gym);

    return Promise.resolve(gym);
  }

  async findById(id: string): Promise<Gym | null> {
    return this.gyms.find(user => user.id === id) || null;
  }
}