import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class PrismaUsersRepository {
  async create({ name, email, password_hash }: Prisma.UserCreateInput) {
    await prisma.user.create({
      data: {
        name,
        email,
        password_hash
      }
    });
  }
}