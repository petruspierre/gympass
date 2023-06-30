import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180;
    }),
  });

  const paramsSchema = z.object({
    gymId: z.string().uuid()
  });

  const { latitude, longitude } = bodySchema.parse(request.body);
  const { gymId } = paramsSchema.parse(request.params);

  const useCase = makeCheckInUseCase();

  await useCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    gymId,
    userId: request.user.sub
  });

  return reply.status(201).send();
}
