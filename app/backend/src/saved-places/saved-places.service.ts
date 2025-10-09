import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SavedPlaceService {
  constructor(private readonly prisma: PrismaService) {}

  async save(userId: number, placeId: number) {
    await this.prisma.savedPlace.upsert({
      where: { userId_placeId: { userId, placeId } },
      create: { userId, placeId },
      update: {},
    });
    return { saved: true };
  }

  async remove(userId: number, placeId: number) {
    await this.prisma.savedPlace.deleteMany({ where: { userId, placeId } });
    return { saved: false };
  }

  async isSaved(userId: number, placeId: number) {
    const count = await this.prisma.savedPlace.count({
      where: { userId, placeId },
    });
    return { saved: count > 0 };
  }

  async listMine(userId: number) {
    const rows = await this.prisma.savedPlace.findMany({
      where: { userId },
      include: {
        place: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
            photos: { select: { url: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((r) => ({
      id: r.place.id,
      name: r.place.name,
      address: r.place.address,
      image: r.place.imageUrl || r.place.photos?.[0]?.url || null,
    }));
  }
}
