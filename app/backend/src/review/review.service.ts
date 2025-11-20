import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Prisma } from '@prisma/client';
import { UserService } from '../user/user.service';
@Injectable()
export class ReviewService {
    constructor(private prisma: PrismaService, private userService: UserService) { }
    async create(userId: number, dto: CreateReviewDto) {
        const review = await this.prisma.review.create({
            data: {
                userId,
                placeId: dto.placeId,
                generalRating: dto.generalRating,
                foodRating: dto.foodRating,
                serviceRating: dto.serviceRating,
                environmentRating: dto.environmentRating,
                comment: dto.comment,
                numberOfPeople: dto.numberOfPeople,
                pricePaid: dto.pricePaid === null || dto.pricePaid === undefined
                    ? undefined
                    : new Prisma.Decimal(dto.pricePaid),
            },
        });
        await this.prisma.activity.create({
            data: {
                type: 'REVIEWED',
                userId,
                placeId: dto.placeId,
                reviewId: review.id,
            },
        });
        // XP: +10 por review criada
        this.userService.addXp(userId, 10).catch(() => { });
        return review;
    }
    findByPlace(placeId: number) {
        return this.prisma.review.findMany({
            where: { placeId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }
    async listForPlace(placeId: number, options: {
        page?: number;
        limit?: number;
        scope?: 'all' | 'friends';
        viewerUserId?: number;
    } = {}) {
        const page = Math.max(1, options.page ?? 1);
        const limit = Math.min(50, Math.max(1, options.limit ?? 20));
        const scope = options.scope ?? 'all';
        let friendsIds: number[] = [];
        if (options.viewerUserId) {
            const follows = await this.prisma.follow.findMany({
                where: { followerId: options.viewerUserId },
                select: { followedId: true },
            });
            friendsIds = follows.map((f) => f.followedId);
        }
        const baseWhere: any = { placeId };
        const where = scope === 'friends' && friendsIds.length > 0
            ? { ...baseWhere, userId: { in: friendsIds } }
            : baseWhere;
        if (scope === 'friends' && friendsIds.length === 0) {
            const totalAll = await this.prisma.review.count({ where: baseWhere });
            return {
                data: [],
                pagination: { page, limit, total: 0, totalPages: 0 },
                counts: { all: totalAll, friends: 0 },
            };
        }
        const [totalAll, totalFriends, reviews] = await this.prisma.$transaction([
            this.prisma.review.count({ where: baseWhere }),
            this.prisma.review.count({
                where: friendsIds.length > 0 ? { ...baseWhere, userId: { in: friendsIds } } : { ...baseWhere, userId: -1 },
            }),
            this.prisma.review.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user: {
                        select: { id: true, username: true, avatarUrl: true },
                    },
                },
            }),
        ]);
        return {
            data: reviews,
            pagination: {
                page,
                limit,
                total: scope === 'friends' ? totalFriends : totalAll,
                totalPages: Math.ceil((scope === 'friends' ? totalFriends : totalAll) / limit),
            },
            counts: { all: totalAll, friends: totalFriends },
        };
    }
}
