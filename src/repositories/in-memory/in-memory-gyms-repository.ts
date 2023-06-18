import { Gym, Prisma } from '@prisma/client';
import {FindManyNearbyParams, GymsRepository} from '../gyms-repository';
import {randomUUID} from 'node:crypto';
import {getDistanceBetweenCoordinates} from '@/utils/get-distance-between-coordinates';

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

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.gyms.filter(gym => gym.title.includes(query)).slice((page - 1) * 20, page * 20);

    return Promise.resolve(gyms);
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.gyms.filter(gym => {
      const distance = getDistanceBetweenCoordinates({
        latitude: params.latitude,
        longitude: params.longitude,
      }, {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      });

      return distance < 10;
    });
  }

  async findById(id: string): Promise<Gym | null> {
    return this.gyms.find(user => user.id === id) || null;
  }
}