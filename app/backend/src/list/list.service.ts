import { BadRequestException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
@Injectable()
export class ListService {
    constructor(private prisma: PrismaService) { }
    async createList(userId: number, dto: CreateListDto) {
        const { placeIds, ...listData } = dto;
        return this.prisma.$transaction(async (prisma) => {
            const list = await prisma.list.create({
                data: {
                    userId,
                    name: listData.name,
                    description: listData.description,
                    imageUrl: listData.imageUrl,
                    isRanking: listData.isRanking ?? false,
                    items: placeIds && placeIds.length > 0
                        ? {
                            create: placeIds.map((id, index) => ({
                                order: index,
                                place: {
                                    connect: { id: id },
                                },
                            })),
                        }
                        : undefined,
                },
            });
            await prisma.activity.create({
                data: {
                    type: 'CREATED_LIST',
                    userId,
                    listId: list.id,
                },
            });
            return list;
        });
    }
    async getMyLists(userId: number) {
        return this.prisma.list.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
                isRanking: true,
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
                user: { select: { username: true } },
            },
        });
        if (!list)
            throw new NotFoundException('Lista não encontrada');
        // Permitir visualização por outros usuários (somente leitura)
        return {
            id: list.id,
            name: list.name,
            description: list.description,
            imageUrl: list.imageUrl,
            isRanking: list.isRanking,
            createdAt: list.createdAt,
            updatedAt: list.updatedAt,
            creatorName: list.user?.username || null,
            items: list.items.map((it) => ({
                placeId: it.placeId,
                order: it.order,
                addedAt: it.addedAt,
                place: it.place,
            })),
        };
    }
    async updateList(userId: number, listId: number, dto: UpdateListDto) {
        const list = await this.prisma.list.findUnique({ where: { id: listId } });
        if (!list)
            throw new NotFoundException('Lista não encontrada');
        if (list.userId !== userId)
            throw new ForbiddenException('Acesso negado');
        return this.prisma.list.update({
            where: { id: listId },
            data: dto,
            select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
                updatedAt: true,
            },
        });
    }
    async deleteList(userId: number, listId: number) {
        const list = await this.prisma.list.findUnique({ where: { id: listId } });
        if (!list)
            throw new NotFoundException('Lista não encontrada');
        if (list.userId !== userId)
            throw new ForbiddenException('Acesso negado');
        await this.prisma.list.delete({ where: { id: listId } });
        return { ok: true };
    }
    async addPlace(userId: number, listId: number, placeId: number) {
        const list = await this.prisma.list.findUnique({ where: { id: listId } });
        if (!list)
            throw new NotFoundException('Lista não encontrada');
        if (list.userId !== userId)
            throw new ForbiddenException('Acesso negado');
        const place = await this.prisma.place.findUnique({
            where: { id: placeId },
        });
        if (!place)
            throw new BadRequestException('Lugar não existente');
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
        }
        catch (e: any) {
            if (e?.code === 'P2002') {
                throw new BadRequestException('O lugar já está na lista');
            }
            throw e;
        }
    }
    async removePlace(userId: number, listId: number, placeId: number) {
        const list = await this.prisma.list.findUnique({ where: { id: listId } });
        if (!list)
            throw new NotFoundException('Lista não encontrada');
        if (list.userId !== userId)
            throw new ForbiddenException('Acesso negado');
        await this.prisma.listItem
            .delete({
            where: { listId_placeId: { listId, placeId } },
        })
            .catch(() => {
            throw new NotFoundException('O lugar não está na lista');
        });
        await this.prisma.list.update({
            where: { id: listId },
            data: { updatedAt: new Date() },
        });
        return { ok: true };
    }
    async reorder(userId: number, listId: number, items: {
        placeId: number;
        order: number;
    }[]) {
        const list = await this.prisma.list.findUnique({ where: { id: listId } });
        if (!list)
            throw new NotFoundException('Lista não encontrada');
        if (list.userId !== userId)
            throw new ForbiddenException('Acesso negado');
        if (!Array.isArray(items) || items.length === 0) {
            throw new BadRequestException('Lista de itens vazia');
        }
        const orders = items.map((i) => i.order);
        if (new Set(orders).size !== orders.length) {
            throw new BadRequestException('A ordem dos itens deve ser única');
        }
        const ids = items.map((i) => i.placeId);
        const existing = await this.prisma.listItem.findMany({
            where: { listId, placeId: { in: ids } },
            select: { placeId: true },
        });
        if (existing.length !== ids.length) {
            throw new BadRequestException('Um ou mais lugares não pertencem a esta lista');
        }
        await this.prisma.$transaction(items.map((i) => this.prisma.listItem.update({
            where: { listId_placeId: { listId, placeId: i.placeId } },
            data: { order: i.order },
        })));
        await this.prisma.list.update({
            where: { id: listId },
            data: { updatedAt: new Date() },
        });
        return { ok: true };
    }
}
