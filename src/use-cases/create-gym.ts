import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface CreateGymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {

  constructor(
    private gymsRepository: GymsRepository
  ) {}

  async execute({ title, latitude, phone, longitude, description }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      latitude,
      phone,
      longitude,
      description
    });

    return {
      gym
    };
  }
}