import { Gym, Prisma } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';
import {randomUUID} from 'node:crypto';

export class InMemoryGymsRepository implements GymsRepository {
  gyms: Gym[] = [];

  create(data: Prisma.GymCreateInput): Promise<Gym> {
    // const gym = {
    //   id: randomUUID(),
    //   title: data.title,
    //   latitude: data.latitude,
    //   longitude: data.longitude,
    //   description: data.description,
    //   phone: data.phone,
    //   created_at: new Date(),
    // };
    //
    // this.gyms.push(gym);
    //
    // return Promise.resolve(gym);
    throw new Error();
  }

  async findById(id: string): Promise<Gym | null> {
    return this.gyms.find(user => user.id === id) || null;
  }
}