import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, dto: CreateReviewDto) {
    const {
      placeId,
      generalRating,
      foodRating,
      serviceRating,
      environmentRating,
      price,
      comment,
    } = dto;

    return this.prisma.review.create({
      data: {
        userId,
        placeId,
        generalRating,
        foodRating,
        serviceRating,
        environmentRating,
        comment,
        price:
          price === null || price === undefined
            ? undefined
            : new Prisma.Decimal(price),
      },
    });
  }

  findAll() {
    return this.prisma.review.findMany();
  }

  findByUser(userId: number) {
    return this.prisma.review.findMany({
      where: { userId },
    });
  }

  findByPlace(placeId: number) {
    return this.prisma.review.findMany({
      where: { placeId },
    });
  }

  delete(id: number) {
    return this.prisma.review.delete({ where: { id } });
  }

  deleteAll() {
    return this.prisma.review.deleteMany();
  }
}
