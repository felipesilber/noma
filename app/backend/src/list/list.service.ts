import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  async createList(
    userId: number,
    dto: { name: string; description?: string },
  ) {
    return this.prisma.list.create({
      data: { userId, name: dto.name, description: dto.description },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getMyLists(userId: number) {
    return this.prisma.list.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { items: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMyListById(userId: number, listId: number) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: {
        items: {
          include: {
            place: {
              select: { id: true, name: true, address: true, imageUrl: true },
            },
          },
          orderBy: [{ order: 'asc' }, { addedAt: 'desc' }],
        },
      },
    });
    if (!list) throw new NotFoundException('Not found');
    if (list.userId !== userId) throw new ForbiddenException('Access denied');

    return {
      id: list.id,
      name: list.name,
      description: list.description,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      items: list.items.map((it) => ({
        placeId: it.placeId,
        order: it.order,
        addedAt: it.addedAt,
        place: it.place,
      })),
    };
  }

  async updateList(
    userId: number,
    listId: number,
    dto: { name?: string; description?: string },
  ) {
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundException('Not found');
    if (list.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.list.update({
      where: { id: listId },
      data: { name: dto.name, description: dto.description },
      select: { id: true, name: true, description: true, updatedAt: true },
    });
  }

  async deleteList(userId: number, listId: number) {
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundException('Not found');
    if (list.userId !== userId) throw new ForbiddenException('Access denied');

    await this.prisma.list.delete({ where: { id: listId } });
    return { ok: true };
  }

  async addPlace(userId: number, listId: number, placeId: number) {
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundException('Not found');
    if (list.userId !== userId) throw new ForbiddenException('Access denied');

    const place = await this.prisma.place.findUnique({
      where: { id: placeId },
    });
    if (!place) throw new BadRequestException('Non-existent place');

    try {
      const item = await this.prisma.listItem.create({
        data: { listId, placeId },
        include: {
          place: {
            select: { id: true, name: true, address: true, imageUrl: true },
          },
        },
      });
      await this.prisma.list.update({
        where: { id: listId },
        data: { updatedAt: new Date() },
      });
      return {
        placeId: item.placeId,
        order: item.order,
        addedAt: item.addedAt,
        place: item.place,
      };
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new BadRequestException('Already on the list');
      }
      throw e;
    }
  }

  async removePlace(userId: number, listId: number, placeId: number) {
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundException('Not found');
    if (list.userId !== userId) throw new ForbiddenException('Access denied');

    await this.prisma.listItem
      .delete({
        where: { listId_placeId: { listId, placeId } },
      })
      .catch(() => {
        throw new NotFoundException('Not on the list');
      });

    await this.prisma.list.update({
      where: { id: listId },
      data: { updatedAt: new Date() },
    });
    return { ok: true };
  }

  async reorder(
    userId: number,
    listId: number,
    items: { placeId: number; order: number }[],
  ) {
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundException('Not found');
    if (list.userId !== userId) throw new ForbiddenException('Access denied');

    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Empty list');
    }
    const orders = items.map((i) => i.order);
    if (new Set(orders).size !== orders.length) {
      throw new BadRequestException('Order must be unique');
    }

    const ids = items.map((i) => i.placeId);
    const existing = await this.prisma.listItem.findMany({
      where: { listId, placeId: { in: ids } },
      select: { placeId: true },
    });
    const existingSet = new Set(existing.map((e) => e.placeId));
    const missing = ids.filter((id) => !existingSet.has(id));
    if (missing.length) {
      throw new BadRequestException(
        `PlaceIds do not belong to the list: ${missing.join(', ')}`,
      );
    }

    await this.prisma.$transaction(
      items.map((i) =>
        this.prisma.listItem.update({
          where: { listId_placeId: { listId, placeId: i.placeId } },
          data: { order: i.order },
        }),
      ),
    );

    await this.prisma.list.update({
      where: { id: listId },
      data: { updatedAt: new Date() },
    });
    return { ok: true };
  }
}
