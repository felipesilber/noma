import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserProfileDto } from './dto/profile.dto';
import moment from 'moment';
@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }
    async getProfileById(profileUserId: number, viewerUserId?: number): Promise<UserProfileDto> {
        const userPromise = this.prisma.user.findUnique({
            where: { id: profileUserId },
            include: {
                favoritePlaces: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        place: { select: { id: true, name: true, imageUrl: true } },
                    },
                },
                lists: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        _count: {
                            select: { items: true },
                        },
                    },
                },
            },
        });
        const statsPromise = this.prisma.$transaction([
            this.prisma.follow.count({ where: { followedId: profileUserId } }),
            this.prisma.follow.count({ where: { followerId: profileUserId } }),
            this.prisma.review.groupBy({
                by: ['placeId'],
                where: { userId: profileUserId },
                orderBy: { placeId: 'asc' },
            }),
            this.prisma.savedPlace.count({ where: { userId: profileUserId } }),
        ]);
        const dashboardStatsPromise = this._getDashboardStats(profileUserId);
        const recentlyVisitedPromise = this.prisma.review.findMany({
            where: { userId: profileUserId },
            take: 10,
            orderBy: { createdAt: 'desc' },
            distinct: ['placeId'],
            include: { place: { select: { id: true, name: true, imageUrl: true } } },
        });
        const followStatusPromise = viewerUserId && viewerUserId !== profileUserId
            ? this.prisma.follow.findUnique({
                where: {
                    followerId_followedId: {
                        followerId: viewerUserId,
                        followedId: profileUserId,
                    },
                },
            })
            : Promise.resolve(null);
        const [user, stats, dashboardStats, recentlyVisited, followStatus] = await Promise.all([
            userPromise,
            statsPromise,
            dashboardStatsPromise,
            recentlyVisitedPromise,
            followStatusPromise,
        ]);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }
        const [followersCount, followingCount, visitedPlacesGroups, wishlistCount] = stats;
        const visitedPlacesCount = visitedPlacesGroups.length;
        const isFollowing = Boolean(followStatus);
        return {
            id: user.id,
            username: user.username,
            avatarUrl: user.avatarUrl,
            joinDate: `Joined ${moment(user.createdAt).year()}`,
            isFollowing,
            stats: {
                followersCount,
                followingCount,
                visitedPlacesCount,
                wishlistCount,
            },
            nomaStatus: {
                level: user.nomaLevel,
                currentXp: user.nomaCurrentXp,
                nextLevelXp: user.nomaNextLevelXp,
            },
            dashboardStats,
            carousels: {
                favoritePlaces: user.favoritePlaces.map((fp) => fp.place),
                recentlyVisitedPlaces: recentlyVisited.map((r) => r.place),
                userLists: user.lists.map((l) => ({
                    id: l.id,
                    name: l.name,
                    imageUrl: l.imageUrl,
                    isRanking: l.isRanking,
                    placesCount: l._count?.items ?? 0,
                })),
            },
        };
    }
    async getMyProfile(userId: number): Promise<UserProfileDto> {
        return this.getProfileById(userId, userId);
    }
    async getVisitedPlaces(userId: number) {
        const rows = await this.prisma.review.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            distinct: ['placeId'],
            include: { place: { select: { id: true, name: true, imageUrl: true } } },
        });
        return rows.map((r) => r.place);
    }
    async getWishlist(userId: number) {
        const rows = await this.prisma.savedPlace.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { place: { select: { id: true, name: true, imageUrl: true } } },
        });
        return rows.map((r) => r.place);
    }
    private async _getDashboardStats(userId: number) {
        const reviews = await this.prisma.review.findMany({
            where: { userId },
            select: {
                generalRating: true,
                createdAt: true,
                place: {
                    select: {
                        category: {
                            select: { name: true },
                        },
                    },
                },
            },
        });
        if (!reviews.length) {
            return {
                favoriteCuisine: 'N/A',
                mostFrequentRating: 0,
                avgReviewsPerWeek: 0,
            };
        }
        const categoryFrequency = new Map<string, number>();
        const ratingFrequency = new Map<number, number>();
        const reviewMoments = reviews.map((review) => {
            const categoryName = review.place?.category?.name;
            if (categoryName) {
                categoryFrequency.set(categoryName, (categoryFrequency.get(categoryName) || 0) + 1);
            }
            ratingFrequency.set(review.generalRating, (ratingFrequency.get(review.generalRating) || 0) + 1);
            return moment(review.createdAt);
        });
        const favoriteCuisineEntry = Array.from(categoryFrequency.entries()).sort((a, b) => b[1] - a[1])[0];
        const favoriteCuisine = favoriteCuisineEntry ? favoriteCuisineEntry[0] : 'N/A';
        const mostFrequentRatingEntry = Array.from(ratingFrequency.entries()).sort((a, b) => b[1] - a[1])[0];
        const mostFrequentRating = mostFrequentRatingEntry
            ? mostFrequentRatingEntry[0]
            : 0;
        const firstReviewDate = moment.min(reviewMoments);
        const lastReviewDate = moment.max(reviewMoments);
        const spanInWeeks = Math.max(1, lastReviewDate.diff(firstReviewDate, 'weeks', true) || 0);
        const avgReviewsPerWeek = Number((reviews.length / spanInWeeks).toFixed(2));
        return {
            favoriteCuisine,
            mostFrequentRating,
            avgReviewsPerWeek,
        };
    }
}
