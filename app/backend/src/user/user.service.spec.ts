import { BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

type PrismaMock = {
  user: {
    create: jest.Mock;
    update: jest.Mock;
    findUnique: jest.Mock;
    findMany: jest.Mock;
    deleteMany: jest.Mock;
  };
  follow: {
    findMany: jest.Mock;
  };
};

const makePrismaMock = (): PrismaMock => ({
  user: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  follow: {
    findMany: jest.fn(),
  },
});

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaMock;

  beforeEach(() => {
    prisma = makePrismaMock();
    service = new UserService(prisma as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates from firebase', async () => {
    prisma.user.create.mockResolvedValue({
      id: 1,
      firebaseUid: 'uid',
      email: null,
      username: null,
    });
    const res = await service.createFromFirebase('uid', null, null);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { firebaseUid: 'uid', email: null, username: null },
    });
    expect(res.id).toBe(1);
  });

  it('updates username', async () => {
    prisma.user.update.mockResolvedValue({ id: 1, username: 'ed' });
    const res = await service.updateUsername(1, 'ed');
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { username: 'ed' },
      select: { id: true, username: true },
    });
    expect(res).toEqual({ id: 1, username: 'ed' });
  });

  it('finds by uid', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, firebaseUid: 'abc' });
    const res = await service.findByUid('abc');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { firebaseUid: 'abc' },
    });
    expect(res?.id).toBe(1);
  });

  it('finds by id', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 7 });
    const res = await service.findById(7);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 7 } });
    expect(res?.id).toBe(7);
  });

  it('lists all', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: 1 }]);
    const res = await service.findAll();
    expect(prisma.user.findMany).toHaveBeenCalled();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('deletes all', async () => {
    prisma.user.deleteMany.mockResolvedValue({ count: 2 });
    const res = await service.deleteAll();
    expect(prisma.user.deleteMany).toHaveBeenCalled();
    expect(res).toEqual({ count: 2 });
  });

  it('search rejects short query', async () => {
    await expect(service.searchUsersByUsername(1, 'a')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('search rejects bad limit', async () => {
    await expect(service.searchUsersByUsername(1, 'ab', 0)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.searchUsersByUsername(1, 'ab', 51)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('search returns empty', async () => {
    prisma.user.findMany.mockResolvedValue([]);
    const res = await service.searchUsersByUsername(1, 'ed');
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        id: { not: 1 },
        username: { contains: 'ed', mode: 'insensitive' },
      },
      select: { id: true, username: true, level: true },
      take: 20,
      orderBy: { username: 'asc' },
    });
    expect(res).toEqual([]);
  });

  it('search maps isFollowing', async () => {
    prisma.user.findMany.mockResolvedValue([
      { id: 2, username: 'ed1', level: 3 },
      { id: 3, username: 'ed2', level: 4 },
    ]);
    prisma.follow.findMany.mockResolvedValue([{ followedId: 3 }]);
    const res = await service.searchUsersByUsername(1, 'ed', 10);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        id: { not: 1 },
        username: { contains: 'ed', mode: 'insensitive' },
      },
      select: { id: true, username: true, level: true },
      take: 10,
      orderBy: { username: 'asc' },
    });
    expect(prisma.follow.findMany).toHaveBeenCalledWith({
      where: { followerId: 1, followedId: { in: [2, 3] } },
      select: { followedId: true },
    });
    expect(res).toEqual([
      { id: 2, username: 'ed1', level: 3, isFollowing: false },
      { id: 3, username: 'ed2', level: 4, isFollowing: true },
    ]);
  });
});
