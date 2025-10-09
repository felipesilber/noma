import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async follow(currentUserId: number, targetUserId: number) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Você não pode seguir a si mesmo');
    }
    await this.prisma.follow.upsert({
      where: {
        followerId_followedId: {
          followerId: currentUserId,
          followedId: targetUserId,
        },
      },
      create: { followerId: currentUserId, followedId: targetUserId },
      update: {},
    });
  }

  async unfollow(currentUserId: number, targetUserId: number) {
    await this.prisma.follow.deleteMany({
      where: { followerId: currentUserId, followedId: targetUserId },
    });
  }

  async isFollowing(currentUserId: number, targetUserId: number) {
    const count = await this.prisma.follow.count({
      where: { followerId: currentUserId, followedId: targetUserId },
    });
    return count > 0;
  }
}
