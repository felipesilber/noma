import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PlaceService } from './place.service';
jest.mock('../shared/utils/utils', () => ({
    priceToSymbols: (level: any) => (level ? '$$' : undefined),
}));
type PrismaMock = {
    place: {
        create: jest.Mock;
        findMany: jest.Mock;
        findUnique: jest.Mock;
        update: jest.Mock;
        deleteMany: jest.Mock;
        count: jest.Mock;
    };
    review: {
        groupBy: jest.Mock;
        findMany: jest.Mock;
    };
    $transaction: jest.Mock;
};
const makePrismaMock = (): PrismaMock => ({
    place: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
    },
    review: {
        groupBy: jest.fn(),
        findMany: jest.fn(),
    },
    $transaction: jest.fn(async (ops: any[]) => {
        if (Array.isArray(ops)) {
            const results = await Promise.all(ops.map((fn) => (typeof fn === 'function' ? fn() : fn)));
            return results;
        }
        return [];
    }),
});
describe('PlaceService', () => {
    let service: PlaceService;
    let prisma: PrismaMock;
    beforeEach(() => {
        prisma = makePrismaMock();
        service = new PlaceService(prisma as any);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        it('creates a place with tags and photos', async () => {
            const dto: any = {
                name: 'Bar X',
                address: 'Rua 1',
                tagNames: ['pet-friendly', 'rooftop'],
                photoUrls: ['u1', 'u2'],
            };
            prisma.place.create.mockResolvedValue({
                id: 1,
                ...dto,
                tags: [
                    { id: 10, name: 'pet-friendly' },
                    { id: 11, name: 'rooftop' },
                ],
                photos: [{ url: 'u1' }, { url: 'u2' }],
            });
            const res = await service.create(dto);
            expect(prisma.place.create).toHaveBeenCalledTimes(1);
            expect(prisma.place.create.mock.calls[0][0]).toMatchObject({
                data: expect.objectContaining({
                    name: 'Bar X',
                    address: 'Rua 1',
                    tags: {
                        connectOrCreate: [
                            {
                                where: { name: 'pet-friendly' },
                                create: { name: 'pet-friendly' },
                            },
                            { where: { name: 'rooftop' }, create: { name: 'rooftop' } },
                        ],
                    },
                    photos: { create: [{ url: 'u1' }, { url: 'u2' }] },
                }),
                include: { tags: true, photos: true },
            });
            expect(res.id).toBe(1);
        });
        it('creates a place without optional arrays', async () => {
            const dto: any = { name: 'Bar Y', address: 'Rua 2' };
            prisma.place.create.mockResolvedValue({
                id: 2,
                ...dto,
                tags: [],
                photos: [],
            });
            const res = await service.create(dto);
            expect(prisma.place.create).toHaveBeenCalledTimes(1);
            expect(res.id).toBe(2);
        });
    });
    describe('findAll', () => {
        it('returns mapped list with avgRating', async () => {
            prisma.place.findMany.mockResolvedValue([
                {
                    id: 1,
                    name: 'A',
                    address: 'Rua A',
                    imageUrl: null,
                    category: { name: 'Bar' },
                    priceLevel: 'TWO',
                    photos: [{ url: 'picA' }],
                },
                {
                    id: 2,
                    name: 'B',
                    address: 'Rua B',
                    imageUrl: 'heroB',
                    category: null,
                    priceLevel: null,
                    photos: [],
                },
            ]);
            prisma.review.groupBy.mockResolvedValue([
                { placeId: 1, _avg: { rating: 4.33 } },
                { placeId: 2, _avg: { rating: 3.99 } },
            ]);
            const res = await service.findAll();
            expect(prisma.place.findMany).toHaveBeenCalledWith({
                select: {
                    id: true,
                    name: true,
                    address: true,
                    imageUrl: true,
                    category: { select: { name: true } },
                    priceLevel: true,
                    photos: { select: { url: true }, take: 1 },
                },
                orderBy: { name: 'asc' },
            });
            expect(prisma.review.groupBy).toHaveBeenCalled();
            expect(res).toEqual([
                {
                    id: 1,
                    name: 'A',
                    address: 'Rua A',
                    image: 'picA',
                    category: 'Bar',
                    priceLevel: 'TWO',
                    avgRating: 4.3,
                },
                {
                    id: 2,
                    name: 'B',
                    address: 'Rua B',
                    image: 'heroB',
                    category: null,
                    priceLevel: null,
                    avgRating: 4.0,
                },
            ]);
        });
        it('returns empty ratings when no reviews', async () => {
            prisma.place.findMany.mockResolvedValue([
                {
                    id: 3,
                    name: 'C',
                    address: 'Rua C',
                    imageUrl: null,
                    category: null,
                    priceLevel: null,
                    photos: [],
                },
            ]);
            prisma.review.groupBy.mockResolvedValue([]);
            const res = await service.findAll();
            expect(res[0].avgRating).toBeUndefined();
        });
    });
    describe('getByCategory', () => {
        it('fetches by categoryId', async () => {
            prisma.place.findMany.mockResolvedValue([{ id: 1 }]);
            const res = await service.getByCategory(7);
            expect(prisma.place.findMany).toHaveBeenCalledWith({
                where: { categoryId: 7 },
            });
            expect(res).toEqual([{ id: 1 }]);
        });
    });
    describe('getVisitedByUser', () => {
        it('returns places by user reviews', async () => {
            prisma.review.findMany = jest
                .fn()
                .mockResolvedValue([{ placeId: 1 }, { placeId: 2 }]);
            prisma.place.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const res = await service.getVisitedByUser(42);
            expect(prisma.review.findMany).toHaveBeenCalledWith({
                where: { userId: 42 },
                select: { placeId: true },
            });
            expect(prisma.place.findMany).toHaveBeenCalledWith({
                where: { id: { in: [1, 2] } },
            });
            expect(res).toEqual([{ id: 1 }, { id: 2 }]);
        });
    });
    describe('searchAdvanced', () => {
        it('builds filters and paginates', async () => {
            prisma.place.count.mockResolvedValue(2);
            prisma.place.findMany.mockResolvedValue([
                {
                    id: 1,
                    name: 'Bar X',
                    address: 'Rua 1',
                    imageUrl: null,
                    category: { id: 9, name: 'Bar' },
                    priceLevel: 'THREE',
                    tags: [{ id: 1, name: 'pet' }],
                    photos: [{ url: 'p1' }],
                },
                {
                    id: 2,
                    name: 'Bar Y',
                    address: 'Rua 2',
                    imageUrl: 'hero',
                    category: { id: 9, name: 'Bar' },
                    priceLevel: null,
                    tags: [],
                    photos: [],
                },
            ]);
            (service as any).getAvgRatingsFor = jest
                .fn()
                .mockResolvedValue(new Map([[1, 4.5]]));
            const out = await service.searchAdvanced({
                q: 'bar',
                categoryIds: [9],
                tagNames: ['pet'],
                priceLevels: ['THREE'],
                page: 1,
                limit: 10,
                sort: 'name_asc',
            } as any);
            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
            expect(out.pagination.total).toBe(2);
            expect(out.data).toEqual([
                {
                    id: 1,
                    name: 'Bar X',
                    address: 'Rua 1',
                    image: 'p1',
                    category: 'Bar',
                    priceLevel: 'THREE',
                    tags: ['pet'],
                    avgRating: 4.5,
                },
                {
                    id: 2,
                    name: 'Bar Y',
                    address: 'Rua 2',
                    image: 'hero',
                    category: 'Bar',
                    priceLevel: null,
                    tags: [],
                    avgRating: undefined,
                },
            ]);
        });
        it('sort=rating_desc still queries by name asc (placeholder)', async () => {
            prisma.place.count.mockResolvedValue(0);
            prisma.place.findMany.mockResolvedValue([]);
            (service as any).getAvgRatingsFor = jest
                .fn()
                .mockResolvedValue(new Map());
            await service.searchAdvanced({ sort: 'rating_desc' } as any);
            expect(prisma.place.findMany.mock.calls[0][0].orderBy).toEqual({
                name: 'asc',
            });
        });
    });
    describe('search', () => {
        it('throws on empty term', async () => {
            await expect(service.search('', 10)).rejects.toThrow(BadRequestException);
        });
        it('returns mapped items with avg', async () => {
            prisma.place.findMany.mockResolvedValue([
                {
                    id: 1,
                    name: 'A',
                    address: 'Rua A',
                    imageUrl: null,
                    photos: [{ url: 'x' }],
                },
                { id: 2, name: 'B', address: 'Rua B', imageUrl: 'hero', photos: [] },
            ]);
            (service as any).getAvgRatingsFor = jest
                .fn()
                .mockResolvedValue(new Map([[2, 4.2]]));
            const res = await service.search('a', 5);
            expect(prisma.place.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { name: { contains: 'a', mode: 'insensitive' } },
                        { address: { contains: 'a', mode: 'insensitive' } },
                    ],
                },
                take: 5,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    address: true,
                    imageUrl: true,
                    photos: { select: { url: true }, take: 1 },
                },
            });
            expect(res).toEqual([
                {
                    id: 1,
                    name: 'A',
                    address: 'Rua A',
                    image: 'x',
                    avgRating: undefined,
                },
                { id: 2, name: 'B', address: 'Rua B', image: 'hero', avgRating: 4.2 },
            ]);
        });
    });
    describe('deleteAll', () => {
        it('calls deleteMany', async () => {
            prisma.place.deleteMany.mockResolvedValue({ count: 3 });
            const res = await service.deleteAll();
            expect(prisma.place.deleteMany).toHaveBeenCalledTimes(1);
            expect(res).toEqual({ count: 3 });
        });
    });
    describe('getDetails', () => {
        it('throws NotFound when place does not exist', async () => {
            prisma.place.findUnique.mockResolvedValue(null);
            await expect(service.getDetails(99)).rejects.toThrow(NotFoundException);
        });
        it('returns mapped details with friends info and opening hours', async () => {
            const now = new Date();
            prisma.place.findUnique.mockResolvedValue({
                id: 1,
                name: 'Bar Z',
                category: { name: 'Bar' },
                address: 'Rua Z',
                phone: '123',
                priceLevel: 'TWO',
                priceRange: 'R$ 50-100',
                tags: [{ name: 'pet' }],
                photos: [{ url: 'img' }],
                openingHours: {
                    monday: '9-18',
                    tuesday: null,
                    wednesday: null,
                    thursday: null,
                    friday: '9-23',
                    saturday: null,
                    sunday: null,
                    statusNow: true,
                    closesAt: '23:00',
                    opensAt: '09:00',
                },
                reviews: [
                    { rating: 4, userId: 10, user: { id: 10, avatarUrl: 'a1' } },
                    { rating: 5, userId: 20, user: { id: 20, avatarUrl: 'a2' } },
                    { rating: null, userId: 30, user: { id: 30, avatarUrl: null } },
                ],
            });
            const res = await service.getDetails(1, [10]);
            expect(prisma.place.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    category: { select: { name: true } },
                    tags: { select: { name: true } },
                    openingHours: {
                        select: {
                            monday: true,
                            tuesday: true,
                            wednesday: true,
                            thursday: true,
                            friday: true,
                            saturday: true,
                            sunday: true,
                            statusNow: true,
                            closesAt: true,
                            opensAt: true,
                        },
                    },
                    reviews: {
                        select: {
                            rating: true,
                            userId: true,
                            user: { select: { id: true, avatarUrl: true } },
                        },
                    },
                    photos: { select: { url: true }, take: 1 },
                },
            });
            expect(res).toMatchObject({
                id: 1,
                name: 'Bar Z',
                category: 'Bar',
                address: 'Rua Z',
                phone: '123',
                image: 'img',
                tags: ['pet'],
                avgRating: 4.5,
                friendsRating: 4.0,
                priceLevel: '$$',
                priceRange: 'R$ 50-100',
                visitedByFriends: [{ id: '10', avatar: 'a1' }],
                openingHours: {
                    status: 'Aberto',
                    closesAt: '23:00',
                    opensAt: '09:00',
                    details: ['Segunda: 9-18', 'Sexta: 9-23'],
                },
            });
        });
    });
    describe('topReviewedThisWeek', () => {
        it('returns empty when no groups', async () => {
            prisma.review.groupBy.mockResolvedValue([]);
            const res = await service.topReviewedThisWeek();
            expect(res).toEqual([]);
        });
        it('returns ranked places with weekly stats', async () => {
            prisma.review.groupBy.mockResolvedValue([
                { placeId: 1, _count: { placeId: 5 }, _avg: { rating: 4.22 } },
                { placeId: 2, _count: { placeId: 3 }, _avg: { rating: 3.6 } },
            ]);
            prisma.place.findMany.mockResolvedValue([
                {
                    id: 1,
                    name: 'A',
                    address: 'Rua A',
                    imageUrl: null,
                    category: { name: 'Bar' },
                    photos: [{ url: 'x' }],
                },
                {
                    id: 2,
                    name: 'B',
                    address: 'Rua B',
                    imageUrl: 'hero',
                    category: { name: 'Rest' },
                    photos: [],
                },
            ]);
            const res = await service.topReviewedThisWeek(5);
            expect(prisma.review.groupBy).toHaveBeenCalled();
            expect(prisma.place.findMany).toHaveBeenCalledWith({
                where: { id: { in: [1, 2] } },
                select: {
                    id: true,
                    name: true,
                    address: true,
                    imageUrl: true,
                    category: { select: { name: true } },
                    photos: { select: { url: true }, take: 1 },
                },
            });
            expect(res).toEqual([
                {
                    rank: 1,
                    id: 1,
                    name: 'A',
                    address: 'Rua A',
                    category: 'Bar',
                    image: 'x',
                    reviewsThisWeek: 5,
                    avgRatingThisWeek: 4.2,
                },
                {
                    rank: 2,
                    id: 2,
                    name: 'B',
                    address: 'Rua B',
                    category: 'Rest',
                    image: 'hero',
                    reviewsThisWeek: 3,
                    avgRatingThisWeek: 3.6,
                },
            ]);
        });
    });
});
