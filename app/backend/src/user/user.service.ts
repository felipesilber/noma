import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  createFromFirebase(
    uid: string,
    email?: string | null,
    username?: string | null,
  ) {
    return this.prisma.user.create({
      data: {
        firebaseUid: uid,
        email: email ?? null,
        username: username ?? null,
      },
    });
  }

  async updateUsername(userId: number, username: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { username },
      select: { id: true, username: true },
    });
  }

  findByUid(uid: string) {
    return this.prisma.user.findUnique({ where: { firebaseUid: uid } });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  deleteAll() {
    return this.prisma.user.deleteMany();
  }

  async searchUsersByUsername(authUserId: number, q: string, limit = 20) {
    const query = (q ?? '').trim();
    if (query.length < 2) {
      throw new BadRequestException(
        'A busca precisa de pelo menos 2 caracteres.',
      );
    }
    if (limit < 1 || limit > 50) {
      throw new BadRequestException('O limite deve estar entre 1 e 50.');
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: { not: authUserId },
        username: { contains: query, mode: 'insensitive' },
      },
      select: { id: true, username: true, level: true },
      take: limit,
      orderBy: { username: 'asc' },
    });

    if (users.length === 0) return [];

    const followRows = await this.prisma.follow.findMany({
      where: {
        followerId: authUserId,
        followedId: { in: users.map((u) => u.id) },
      },
      select: { followedId: true },
    });
    const followedSet = new Set(followRows.map((f) => f.followedId));

    return users.map((u) => ({
      id: u.id,
      username: u.username,
      level: u.level,
      isFollowing: followedSet.has(u.id),
    }));
  }
}
