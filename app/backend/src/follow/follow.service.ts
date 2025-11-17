import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class FollowService {
    constructor(private prisma: PrismaService) { }
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
    async listFollowers(targetUserId: number, viewerUserId?: number, page = 1, limit = 20) {
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.follow.count({ where: { followedId: targetUserId } }),
            this.prisma.follow.findMany({
                where: { followedId: targetUserId },
                orderBy: { followerId: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    follower: { select: { id: true, username: true, avatarUrl: true } },
                },
            }),
        ]);
        let viewerFollowingIds = new Set<number>();
        if (viewerUserId) {
            const following = await this.prisma.follow.findMany({
                where: { followerId: viewerUserId },
                select: { followedId: true },
            });
            viewerFollowingIds = new Set(following.map((f) => f.followedId));
        }
        const data = rows.map((r) => ({
            id: r.follower.id,
            username: r.follower.username,
            avatarUrl: r.follower.avatarUrl,
            isFollowing: viewerFollowingIds.has(r.follower.id),
        }));
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async listFollowing(targetUserId: number, viewerUserId?: number, page = 1, limit = 20) {
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.follow.count({ where: { followerId: targetUserId } }),
            this.prisma.follow.findMany({
                where: { followerId: targetUserId },
                orderBy: { followedId: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    followed: { select: { id: true, username: true, avatarUrl: true } },
                },
            }),
        ]);
        let viewerFollowingIds = new Set<number>();
        if (viewerUserId) {
            const following = await this.prisma.follow.findMany({
                where: { followerId: viewerUserId },
                select: { followedId: true },
            });
            viewerFollowingIds = new Set(following.map((f) => f.followedId));
        }
        const data = rows.map((r) => ({
            id: r.followed.id,
            username: r.followed.username,
            avatarUrl: r.followed.avatarUrl,
            isFollowing: viewerFollowingIds.has(r.followed.id),
        }));
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
