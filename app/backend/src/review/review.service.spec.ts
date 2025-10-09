import { ReviewService } from './review.service';
import { Prisma } from '@prisma/client';

type PrismaMock = {
  review: {
    create: jest.Mock;
    findMany: jest.Mock;
    delete: jest.Mock;
    deleteMany: jest.Mock;
  };
};

const makePrismaMock = (): PrismaMock => ({
  review: {
    create: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
});

describe('ReviewService', () => {
  let service: ReviewService;
  let prisma: PrismaMock;

  beforeEach(() => {
    prisma = makePrismaMock();
    service = new ReviewService(prisma as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates review with decimal price', async () => {
    const dto: any = { placeId: 1, rating: 5, comment: 'Great', price: 12.5 };
    prisma.review.create.mockResolvedValue({
      id: 1,
      ...dto,
      price: new Prisma.Decimal(12.5),
    });

    const res = await service.create(10, dto);

    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        userId: 10,
        placeId: 1,
        rating: 5,
        comment: 'Great',
        price: new Prisma.Decimal(12.5),
      },
    });
    expect(res).toMatchObject({ id: 1, placeId: 1 });
  });

  it('creates review without price when null', async () => {
    const dto: any = { placeId: 1, rating: 4, comment: 'ok', price: null };
    prisma.review.create.mockResolvedValue({ id: 2, ...dto, price: undefined });

    const res = await service.create(11, dto);

    expect(prisma.review.create.mock.calls[0][0].data.price).toBeUndefined();
    expect(res.id).toBe(2);
  });

  it('findAll returns reviews', async () => {
    prisma.review.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const res = await service.findAll();

    expect(prisma.review.findMany).toHaveBeenCalled();
    expect(res.length).toBe(2);
  });

  it('findByUser filters by userId', async () => {
    prisma.review.findMany.mockResolvedValue([{ id: 1, userId: 5 }]);

    const res = await service.findByUser(5);

    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: { userId: 5 },
    });
    expect(res[0].userId).toBe(5);
  });

  it('findByPlace filters by placeId', async () => {
    prisma.review.findMany.mockResolvedValue([{ id: 1, placeId: 7 }]);

    const res = await service.findByPlace(7);

    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: { placeId: 7 },
    });
    expect(res[0].placeId).toBe(7);
  });

  it('delete removes by id', async () => {
    prisma.review.delete.mockResolvedValue({ id: 99 });

    const res = await service.delete(99);

    expect(prisma.review.delete).toHaveBeenCalledWith({ where: { id: 99 } });
    expect(res.id).toBe(99);
  });

  it('deleteAll calls deleteMany', async () => {
    prisma.review.deleteMany.mockResolvedValue({ count: 3 });

    const res = await service.deleteAll();

    expect(prisma.review.deleteMany).toHaveBeenCalled();
    expect(res).toEqual({ count: 3 });
  });
});
