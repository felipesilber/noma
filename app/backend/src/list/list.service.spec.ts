import { BadRequestException, ForbiddenException, NotFoundException, } from '@nestjs/common';
import { ListService } from './list.service';
type PrismaMock = {
    list: {
        create: jest.Mock;
        findMany: jest.Mock;
        findUnique: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
    listItem: {
        create: jest.Mock;
        delete: jest.Mock;
        update: jest.Mock;
        findMany: jest.Mock;
    };
    place: {
        findUnique: jest.Mock;
    };
    $transaction: jest.Mock;
};
const makePrismaMock = (): PrismaMock => ({
    list: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    listItem: {
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
    },
    place: {
        findUnique: jest.fn(),
    },
    $transaction: jest.fn(async (ops: any[]) => {
        if (Array.isArray(ops)) {
            await Promise.all(ops);
        }
        return [];
    }),
});
describe('ListService', () => {
    let service: ListService;
    let prisma: PrismaMock;
    beforeEach(() => {
        prisma = makePrismaMock();
        service = new ListService(prisma as any);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('createList', () => {
        it('creates and returns selected fields', async () => {
            const now = new Date();
            prisma.list.create.mockResolvedValue({
                id: 1,
                name: 'Favoritos',
                description: 'Meus lugares',
                createdAt: now,
                updatedAt: now,
            });
            const res = await service.createList(10, {
                name: 'Favoritos',
                description: 'Meus lugares',
            });
            expect(prisma.list.create).toHaveBeenCalledWith({
                data: { userId: 10, name: 'Favoritos', description: 'Meus lugares' },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            expect(res).toMatchObject({
                id: 1,
                name: 'Favoritos',
                description: 'Meus lugares',
                createdAt: now,
                updatedAt: now,
            });
        });
    });
    describe('getMyLists', () => {
        it('returns lists with items count ordered by updatedAt desc', async () => {
            const now = new Date();
            prisma.list.findMany.mockResolvedValue([
                {
                    id: 2,
                    name: 'Bares',
                    description: null,
                    createdAt: now,
                    updatedAt: now,
                    _count: { items: 3 },
                },
            ]);
            const res = await service.getMyLists(10);
            expect(prisma.list.findMany).toHaveBeenCalledWith({
                where: { userId: 10 },
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
            expect(res).toHaveLength(1);
            expect(res[0]._count.items).toBe(3);
        });
    });
    describe('getMyListById', () => {
        it('throws NotFound when list does not exist', async () => {
            prisma.list.findUnique.mockResolvedValue(null);
            await expect(service.getMyListById(10, 123)).rejects.toThrow(NotFoundException);
        });
        it('throws Forbidden when not owner', async () => {
            prisma.list.findUnique.mockResolvedValue({
                id: 1,
                userId: 99,
                items: [],
            });
            await expect(service.getMyListById(10, 1)).rejects.toThrow(ForbiddenException);
        });
        it('returns mapped list with items/place', async () => {
            const now = new Date();
            prisma.list.findUnique.mockResolvedValue({
                id: 1,
                userId: 10,
                name: 'Favoritos',
                description: 'x',
                createdAt: now,
                updatedAt: now,
                items: [
                    {
                        placeId: 55,
                        order: 1,
                        addedAt: now,
                        place: {
                            id: 55,
                            name: 'Bar X',
                            address: 'Rua 1',
                            imageUrl: 'http://...',
                        },
                    },
                ],
            });
            const res = await service.getMyListById(10, 1);
            expect(prisma.list.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
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
            expect(res.items[0]).toMatchObject({
                placeId: 55,
                order: 1,
                place: { id: 55, name: 'Bar X' },
            });
        });
    });
    describe('updateList', () => {
        it('throws NotFound if list does not exist', async () => {
            prisma.list.findUnique.mockResolvedValue(null);
            await expect(service.updateList(10, 1, { name: 'x' })).rejects.toThrow(NotFoundException);
        });
        it('throws Forbidden if not owner', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 99 });
            await expect(service.updateList(10, 1, { name: 'x' })).rejects.toThrow(ForbiddenException);
        });
        it('updates and returns selected fields', async () => {
            const now = new Date();
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            prisma.list.update.mockResolvedValue({
                id: 1,
                name: 'novo',
                description: 'desc',
                updatedAt: now,
            });
            const res = await service.updateList(10, 1, {
                name: 'novo',
                description: 'desc',
            });
            expect(prisma.list.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'novo', description: 'desc' },
                select: { id: true, name: true, description: true, updatedAt: true },
            });
            expect(res.name).toBe('novo');
        });
    });
    describe('deleteList', () => {
        it('throws NotFound if list does not exist', async () => {
            prisma.list.findUnique.mockResolvedValue(null);
            await expect(service.deleteList(10, 1)).rejects.toThrow(NotFoundException);
        });
        it('throws Forbidden if not owner', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 99 });
            await expect(service.deleteList(10, 1)).rejects.toThrow(ForbiddenException);
        });
        it('deletes and returns { ok: true }', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            prisma.list.delete.mockResolvedValue({ id: 1 });
            const res = await service.deleteList(10, 1);
            expect(prisma.list.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res).toEqual({ ok: true });
        });
    });
    describe('addPlace', () => {
        it('throws NotFound if list does not exist', async () => {
            prisma.list.findUnique.mockResolvedValue(null);
            await expect(service.addPlace(10, 1, 55)).rejects.toThrow(NotFoundException);
        });
        it('throws Forbidden if not owner', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 99 });
            await expect(service.addPlace(10, 1, 55)).rejects.toThrow(ForbiddenException);
        });
        it('throws BadRequest if place does not exist', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            prisma.place.findUnique.mockResolvedValue(null);
            await expect(service.addPlace(10, 1, 999)).rejects.toThrow(BadRequestException);
        });
        it('returns mapped item and updates updatedAt on success', async () => {
            const now = new Date();
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            prisma.place.findUnique.mockResolvedValue({ id: 55 });
            prisma.listItem.create.mockResolvedValue({
                listId: 1,
                placeId: 55,
                order: 2,
                addedAt: now,
                place: { id: 55, name: 'Bar X', address: 'Rua 1', imageUrl: 'img' },
            });
            prisma.list.update.mockResolvedValue({ id: 1 });
            const res = await service.addPlace(10, 1, 55);
            expect(prisma.listItem.create).toHaveBeenCalledWith({
                data: { listId: 1, placeId: 55 },
                include: {
                    place: {
                        select: { id: true, name: true, address: true, imageUrl: true },
                    },
                },
            });
            expect(prisma.list.update).toHaveBeenCalled();
            expect(res).toMatchObject({
                placeId: 55,
                order: 2,
                place: { id: 55, name: 'Bar X' },
            });
        });
        it('throws Already on the list (P2002)', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            prisma.place.findUnique.mockResolvedValue({ id: 55 });
            const err: any = new Error('Unique constraint');
            err.code = 'P2002';
            prisma.listItem.create.mockRejectedValue(err);
            await expect(service.addPlace(10, 1, 55)).rejects.toThrow('Already on the list');
        });
    });
    describe('removePlace', () => {
        it('throws NotFound if list does not exist', async () => {
            prisma.list.findUnique.mockResolvedValue(null);
            await expect(service.removePlace(10, 1, 55)).rejects.toThrow(NotFoundException);
        });
        it('throws Forbidden if not owner', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 99 });
            await expect(service.removePlace(10, 1, 55)).rejects.toThrow(ForbiddenException);
        });
        it('throws NotFound "Not on the list" if delete fails', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            prisma.listItem.delete.mockRejectedValue(new Error('not found'));
            await expect(service.removePlace(10, 1, 55)).rejects.toThrow('Not on the list');
        });
        it('removes successfully and updates updatedAt', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            prisma.listItem.delete.mockResolvedValue({ listId: 1, placeId: 55 });
            prisma.list.update.mockResolvedValue({ id: 1 });
            const res = await service.removePlace(10, 1, 55);
            expect(prisma.listItem.delete).toHaveBeenCalledWith({
                where: { listId_placeId: { listId: 1, placeId: 55 } },
            });
            expect(prisma.list.update).toHaveBeenCalled();
            expect(res).toEqual({ ok: true });
        });
    });
    describe('reorder', () => {
        it('throws NotFound if list does not exist', async () => {
            prisma.list.findUnique.mockResolvedValue(null);
            await expect(service.reorder(10, 1, [{ placeId: 1, order: 1 }])).rejects.toThrow(NotFoundException);
        });
        it('throws Forbidden if not owner', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 99 });
            await expect(service.reorder(10, 1, [{ placeId: 1, order: 1 }])).rejects.toThrow(ForbiddenException);
        });
        it('throws BadRequest if items empty', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            await expect(service.reorder(10, 1, [])).rejects.toThrow('Empty list');
        });
        it('throws BadRequest if duplicate order', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            await expect(service.reorder(10, 1, [
                { placeId: 1, order: 1 },
                { placeId: 2, order: 1 },
            ])).rejects.toThrow('Order must be unique');
        });
        it('throws BadRequest if a placeId is not in list', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            prisma.listItem.findMany.mockResolvedValue([{ placeId: 1 }]);
            await expect(service.reorder(10, 1, [
                { placeId: 1, order: 1 },
                { placeId: 2, order: 2 },
            ])).rejects.toThrow('PlaceIds do not belong to the list: 2');
        });
        it('$transaction reorders and updates updatedAt', async () => {
            prisma.list.findUnique.mockResolvedValue({ id: 1, userId: 10 });
            prisma.listItem.findMany.mockResolvedValue([
                { placeId: 1 },
                { placeId: 2 },
            ]);
            prisma.listItem.update.mockResolvedValue({});
            prisma.list.update.mockResolvedValue({ id: 1 });
            const res = await service.reorder(10, 1, [
                { placeId: 1, order: 2 },
                { placeId: 2, order: 1 },
            ]);
            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
            expect(prisma.list.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { updatedAt: expect.any(Date) },
            });
            expect(res).toEqual({ ok: true });
        });
    });
});
