import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }
    createFromFirebase(uid: string, email?: string | null, username?: string | null) {
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
            throw new BadRequestException('A busca precisa de pelo menos 2 caracteres.');
        }
        if (limit < 1 || limit > 50) {
            throw new BadRequestException('O limite deve estar entre 1 e 50.');
        }
        const users = await this.prisma.user.findMany({
            where: {
                id: { not: authUserId },
                username: { contains: query, mode: 'insensitive' },
            },
            select: { id: true, username: true, nomaLevel: true, avatarUrl: true },
            take: limit,
            orderBy: { username: 'asc' },
        });
        if (users.length === 0)
            return [];
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
            level: u.nomaLevel,
            imageUrl: u.avatarUrl,
            isFollowing: followedSet.has(u.id),
        }));
    }
    async findRandomUsers(limit: number, authUserId: number) {
        const userCount = await this.prisma.user.count({
            where: { id: { not: authUserId } },
        });
        if (userCount === 0)
            return [];
        const safeLimit = Math.min(limit, userCount);
        const skip = userCount > safeLimit
            ? Math.floor(Math.random() * (userCount - safeLimit))
            : 0;
        const users = await this.prisma.user.findMany({
            where: { id: { not: authUserId } },
            take: safeLimit,
            skip: skip,
            select: { id: true, username: true, avatarUrl: true, nomaLevel: true },
        });
        const userIds = users.map((u) => u.id);
        const followRows = await this.prisma.follow.findMany({
            where: {
                followerId: authUserId,
                followedId: { in: userIds },
            },
            select: { followedId: true },
        });
        const followedSet = new Set(followRows.map((f) => f.followedId));
        const followerCounts = await this.prisma.follow.groupBy({
            by: ['followedId'],
            where: {
                followedId: { in: userIds },
            },
            _count: {
                followedId: true,
            },
        });
        const followerCountMap = new Map(followerCounts.map((fc) => [fc.followedId, fc._count.followedId]));
        return users.map((u) => ({
            id: u.id,
            username: u.username,
            avatarUrl: u.avatarUrl,
            level: u.nomaLevel,
            details: `${followerCountMap.get(u.id) || 0} seguidores`,
            isFollowing: followedSet.has(u.id),
        }));
    }
    async findActiveUsers(authUserId: number, limit: number) {
        const users = await this.prisma.user.findMany({
            where: {
                id: { not: authUserId },
                reviews: { some: {} },
            },
            include: {
                _count: {
                    select: { reviews: true },
                },
            },
            orderBy: {
                reviews: { _count: 'desc' },
            },
            take: limit,
        });
        if (users.length === 0)
            return [];
        const userIds = users.map((u) => u.id);
        const followRows = await this.prisma.follow.findMany({
            where: {
                followerId: authUserId,
                followedId: { in: userIds },
            },
            select: { followedId: true },
        });
        const followedSet = new Set(followRows.map((f) => f.followedId));
        return users.map((u) => ({
            id: u.id,
            username: u.username,
            avatarUrl: u.avatarUrl,
            details: `${u._count.reviews} ${u._count.reviews === 1 ? 'avaliação' : 'avaliações'}`,
            isFollowing: followedSet.has(u.id),
        }));
    }
}
