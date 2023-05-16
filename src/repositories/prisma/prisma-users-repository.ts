import { prisma } from '@/lib/prisma';
import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
  async create({ name, email, password_hash }: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data: {
        name,
        email,
        password_hash
      }
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id
      }
    });
  }
}