import { SavedPlaceService } from './saved-places.service';

type PrismaMock = {
  savedPlace: {
    upsert: jest.Mock;
    deleteMany: jest.Mock;
    count: jest.Mock;
    findMany: jest.Mock;
  };
};

const makePrismaMock = (): PrismaMock => ({
  savedPlace: {
    upsert: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn(),
  },
});

describe('SavedPlaceService', () => {
  let service: SavedPlaceService;
  let prisma: PrismaMock;

  beforeEach(() => {
    prisma = makePrismaMock();
    service = new SavedPlaceService(prisma as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('saves a place', async () => {
    prisma.savedPlace.upsert.mockResolvedValue({ id: 1 });

    const res = await service.save(10, 55);

    expect(prisma.savedPlace.upsert).toHaveBeenCalledWith({
      where: { userId_placeId: { userId: 10, placeId: 55 } },
      create: { userId: 10, placeId: 55 },
      update: {},
    });
    expect(res).toEqual({ saved: true });
  });

  it('removes a place', async () => {
    prisma.savedPlace.deleteMany.mockResolvedValue({ count: 1 });

    const res = await service.remove(10, 55);

    expect(prisma.savedPlace.deleteMany).toHaveBeenCalledWith({
      where: { userId: 10, placeId: 55 },
    });
    expect(res).toEqual({ saved: false });
  });

  it('returns saved=true when count > 0', async () => {
    prisma.savedPlace.count.mockResolvedValue(2);

    const res = await service.isSaved(10, 55);

    expect(prisma.savedPlace.count).toHaveBeenCalledWith({
      where: { userId: 10, placeId: 55 },
    });
    expect(res).toEqual({ saved: true });
  });

  it('returns saved=false when count = 0', async () => {
    prisma.savedPlace.count.mockResolvedValue(0);

    const res = await service.isSaved(10, 55);

    expect(res).toEqual({ saved: false });
  });

  it('lists mine with mapped fields', async () => {
    prisma.savedPlace.findMany.mockResolvedValue([
      {
        placeId: 55,
        place: {
          id: 55,
          name: 'Bar X',
          address: 'Rua 1',
          imageUrl: null,
          photos: [{ url: 'photo1' }],
        },
      },
      {
        placeId: 56,
        place: {
          id: 56,
          name: 'Bar Y',
          address: 'Rua 2',
          imageUrl: 'heroY',
          photos: [],
        },
      },
    ]);

    const res = await service.listMine(10);

    expect(prisma.savedPlace.findMany).toHaveBeenCalledWith({
      where: { userId: 10 },
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
    expect(res).toEqual([
      { id: 55, name: 'Bar X', address: 'Rua 1', image: 'photo1' },
      { id: 56, name: 'Bar Y', address: 'Rua 2', image: 'heroY' },
    ]);
  });
});
