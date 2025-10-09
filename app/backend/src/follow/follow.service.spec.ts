import { BadRequestException } from '@nestjs/common';
import { FollowService } from './follow.service';

type PrismaFollowMock = {
  upsert: jest.Mock;
  deleteMany: jest.Mock;
  count: jest.Mock;
};

type PrismaMock = {
  follow: PrismaFollowMock;
};

const makePrismaMock = (): PrismaMock => ({
  follow: {
    upsert: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  },
});

describe('FollowService', () => {
  let service: FollowService;
  let prismaMock: PrismaMock;

  beforeEach(() => {
    prismaMock = makePrismaMock();
    service = new FollowService(prismaMock as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('follow', () => {
    it('errors when following self', async () => {
      await expect(service.follow(10, 10)).rejects.toThrow(BadRequestException);
      await expect(service.follow(10, 10)).rejects.toThrow(
        'Você não pode seguir a si mesmo',
      );
      expect(prismaMock.follow.upsert).not.toHaveBeenCalled();
    });

    it('calls upsert with correct ids', async () => {
      prismaMock.follow.upsert.mockResolvedValue({
        id: 1,
        followerId: 10,
        followedId: 20,
      });

      await service.follow(10, 20);

      expect(prismaMock.follow.upsert).toHaveBeenCalledTimes(1);
      expect(prismaMock.follow.upsert).toHaveBeenCalledWith({
        where: {
          followerId_followedId: { followerId: 10, followedId: 20 },
        },
        create: { followerId: 10, followedId: 20 },
        update: {},
      });
    });

    it('is idempotent when follow exists', async () => {
      prismaMock.follow.upsert.mockResolvedValue({
        id: 99,
        followerId: 10,
        followedId: 20,
      });

      await expect(service.follow(10, 20)).resolves.toBeUndefined();
      expect(prismaMock.follow.upsert).toHaveBeenCalled();
    });

    it('propagates Prisma errors on follow', async () => {
      prismaMock.follow.upsert.mockRejectedValue(new Error('DB error'));

      await expect(service.follow(10, 20)).rejects.toThrow('DB error');
    });
  });

  describe('unfollow', () => {
    it('deletes using deleteMany', async () => {
      prismaMock.follow.deleteMany.mockResolvedValue({ count: 1 });

      await service.unfollow(10, 20);

      expect(prismaMock.follow.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.follow.deleteMany).toHaveBeenCalledWith({
        where: { followerId: 10, followedId: 20 },
      });
    });

    it('propagates Prisma errors on unfollow', async () => {
      prismaMock.follow.deleteMany.mockRejectedValue(new Error('DB error'));

      await expect(service.unfollow(10, 20)).rejects.toThrow('DB error');
    });
  });

  describe('isFollowing', () => {
    it('returns true when count > 0', async () => {
      prismaMock.follow.count.mockResolvedValue(2);

      const res = await service.isFollowing(10, 20);

      expect(res).toBe(true);
      expect(prismaMock.follow.count).toHaveBeenCalledWith({
        where: { followerId: 10, followedId: 20 },
      });
    });

    it('returns false when count = 0', async () => {
      prismaMock.follow.count.mockResolvedValue(0);

      const res = await service.isFollowing(10, 20);

      expect(res).toBe(false);
    });

    it('propagates Prisma errors on isFollowing', async () => {
      prismaMock.follow.count.mockRejectedValue(new Error('DB error'));

      await expect(service.isFollowing(10, 20)).rejects.toThrow('DB error');
    });
  });
});
