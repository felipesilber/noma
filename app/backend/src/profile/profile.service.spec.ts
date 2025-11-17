import { ProfileService } from './profile.service';
type PrismaMock = {
    user: {
        findUnique: jest.Mock;
    };
    review: {
        count: jest.Mock;
        findMany: jest.Mock;
    };
    list: {
        findMany: jest.Mock;
    };
    follow: {
        count: jest.Mock;
    };
    savedPlace: {
        count: jest.Mock;
    };
};
const makePrismaMock = (): PrismaMock => ({
    user: { findUnique: jest.fn() },
    review: { count: jest.fn(), findMany: jest.fn() },
    list: { findMany: jest.fn() },
    follow: { count: jest.fn() },
    savedPlace: { count: jest.fn() },
});
describe('ProfileService', () => {
    let service: ProfileService;
    let prisma: PrismaMock;
    beforeEach(() => {
        prisma = makePrismaMock();
        service = new ProfileService(prisma as any);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('returns full profile with lastVisited and lists', async () => {
        const now = new Date();
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            username: 'ed',
            level: 5,
        });
        prisma.review.count.mockResolvedValue(4);
        prisma.review.findMany
            .mockResolvedValueOnce([
            {
                id: 101,
                placeId: 11,
                createdAt: now,
                rating: 5,
                place: { id: 11, name: 'Bar A', address: 'Rua A', imageUrl: 'i1' },
            },
            {
                id: 102,
                placeId: 12,
                createdAt: now,
                rating: 4,
                place: { id: 12, name: 'Bar B', address: null, imageUrl: null },
            },
        ])
            .mockResolvedValueOnce([{ placeId: 11 }, { placeId: 12 }]);
        prisma.list.findMany.mockResolvedValue([
            {
                id: 201,
                name: 'Favs',
                description: 'desc',
                createdAt: now,
                updatedAt: now,
                _count: { items: 2 },
                items: [
                    {
                        placeId: 11,
                        order: 1,
                        place: { id: 11, name: 'Bar A', imageUrl: 'i1' },
                    },
                    {
                        placeId: 12,
                        order: 2,
                        place: { id: 12, name: 'Bar B', imageUrl: 'i2' },
                    },
                ],
            },
        ]);
        prisma.follow.count.mockResolvedValueOnce(3).mockResolvedValueOnce(5);
        prisma.savedPlace.count.mockResolvedValue(7);
        const res = await service.getMyProfile(1);
        expect(res).toMatchObject({
            id: 1,
            username: 'ed',
            level: 5,
            visitsCount: 4,
            uniquePlacesCount: 2,
            followersCount: 3,
            followingCount: 5,
            savedPlacesCount: 7,
        });
        expect(res.lastVisited.length).toBe(2);
        expect(res.lists[0]).toMatchObject({
            id: 201,
            name: 'Favs',
            itemsCount: 2,
            preview: [
                { placeId: 11, name: 'Bar A', imageUrl: 'i1', order: 1 },
                { placeId: 12, name: 'Bar B', imageUrl: 'i2', order: 2 },
            ],
        });
    });
    it('handles empty data gracefully', async () => {
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.review.count.mockResolvedValue(0);
        prisma.review.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
        prisma.list.findMany.mockResolvedValue([]);
        prisma.follow.count.mockResolvedValue(0);
        prisma.savedPlace.count.mockResolvedValue(0);
        const res = await service.getMyProfile(99);
        expect(res.id).toBe(99);
        expect(res.username).toBeNull();
        expect(res.level).toBe(1);
        expect(res.visitsCount).toBe(0);
        expect(res.uniquePlacesCount).toBe(0);
        expect(res.lastVisited).toEqual([]);
        expect(res.lists).toEqual([]);
    });
});
