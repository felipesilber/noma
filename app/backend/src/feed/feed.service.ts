import { Injectable } from '@nestjs/common';
import { HomeFeedDto, PlaceSummaryDto } from './dto/feed.dto';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class FeedService {
    constructor(private prisma: PrismaService) { }
    async getHomeFeed(userId: number): Promise<HomeFeedDto> {
        const [featuredPlaces, recommendedPlaces, friendActivityPreview, events] = await Promise.all([
            this._getFeaturedPlaces(userId),
            this._getRecommendedPlaces(userId),
            this._getFriendActivityPreview(userId),
            this._getEvents(),
        ]);
        return {
            featuredPlaces,
            recommendedPlaces,
            friendActivityPreview,
            events,
        };
    }
    private async _getFeaturedPlaces(userId: number): Promise<PlaceSummaryDto[]> {
        const places = await this.prisma.place.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { category: true },
        });
        const ids = places.map((p) => p.id);
        const [friendsCountMap, ratingMap] = await Promise.all([
            this._getFriendsReviewsCount(userId, ids),
            this._getAvgRatingsForPlaceIds(ids),
        ]);
        return places.map((p) => this._toPlaceSummaryDto(p, friendsCountMap.get(p.id) || 0, ratingMap.get(p.id)));
    }
    private async _getRecommendedPlaces(userId: number): Promise<PlaceSummaryDto[]> {
        const topCategory = await this.prisma.review.groupBy({
            by: ['placeId'],
            where: { userId },
            _count: { placeId: true },
            orderBy: { _count: { placeId: 'desc' } },
            take: 1,
        });
        if (!topCategory.length)
            return this._getFeaturedPlaces(userId);
        const places = await this.prisma.place.findMany({
            take: 5,
            include: { category: true },
        });
        const ids = places.map((p) => p.id);
        const [friendsCountMap, ratingMap] = await Promise.all([
            this._getFriendsReviewsCount(userId, ids),
            this._getAvgRatingsForPlaceIds(ids),
        ]);
        return places.map((p) => this._toPlaceSummaryDto(p, friendsCountMap.get(p.id) || 0, ratingMap.get(p.id)));
    }
    private async _getFriendActivityPreview(userId: number) {
        const following = await this.prisma.follow.findMany({
            where: { followerId: userId },
            select: { followedId: true },
        });
        const friendIds = following.map((f) => f.followedId);
        if (friendIds.length === 0)
            return [];
        const activities = await this.prisma.activity.findMany({
            where: { userId: { in: friendIds } },
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { username: true, avatarUrl: true } },
                place: { select: { name: true } },
                review: { select: { generalRating: true } },
                list: { select: { name: true } },
            },
        });
        return activities.map((act) => {
            let actionText = '';
            const placeName = act.place?.name || 'um lugar';
            switch (act.type) {
                case 'REVIEWED':
                    const rating = act.review?.generalRating;
                    if (rating) {
                        actionText = `avaliou ${placeName} com ${rating} estrelas`;
                    }
                    else {
                        actionText = `avaliou ${placeName}`;
                    }
                    break;
                case 'SAVED':
                    actionText = `salvou ${placeName}`;
                    break;
                case 'CHECKED_IN':
                    actionText = `fez check-in em ${placeName}`;
                    break;
                case 'CREATED_LIST':
                    actionText = `criou a lista "${act.list?.name || 'uma nova lista'}"`;
                    break;
                default:
                    actionText = 'realizou uma atividade.';
            }
            return {
                user: act.user,
                actionText: `${act.user.username || 'Um usuário'} ${actionText}`,
                timestamp: act.createdAt,
            };
        });
    }
    private async _getEvents() {
        const events = await this.prisma.event.findMany({
            where: { endDate: { gte: new Date() } },
            take: 5,
            orderBy: { startDate: 'asc' },
            include: { place: { select: { id: true, name: true } } },
        });
        return events.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            imageUrl: event.imageUrl,
            place: event.place,
        }));
    }
    private async _getFriendsReviewsCount(userId: number, placeIds: number[]): Promise<Map<number, number>> {
        if (!placeIds.length)
            return new Map();
        const follows = await this.prisma.follow.findMany({
            where: { followerId: userId },
            select: { followedId: true },
        });
        const friendIds = follows.map((f) => f.followedId);
        if (!friendIds.length)
            return new Map();
        const rows = await this.prisma.review.findMany({
            where: {
                placeId: { in: placeIds },
                userId: { in: friendIds },
            },
            select: { placeId: true, userId: true },
        });
        const map = new Map<number, Set<number>>();
        for (const row of rows) {
            if (!map.has(row.placeId)) {
                map.set(row.placeId, new Set<number>());
            }
            map.get(row.placeId)!.add(row.userId);
        }
        const counts = new Map<number, number>();
        for (const [placeId, set] of map.entries()) {
            counts.set(placeId, set.size);
        }
        return counts;
    }
    private async _getAvgRatingsForPlaceIds(placeIds: number[]): Promise<Map<number, number | null>> {
        if (!placeIds.length)
            return new Map();
        const avgRatings = await this.prisma.review.groupBy({
            by: ['placeId'],
            where: { placeId: { in: placeIds } },
            _avg: { generalRating: true },
            orderBy: { placeId: 'asc' },
        });
        return new Map(avgRatings.map((r) => [r.placeId, r._avg.generalRating]));
    }
    private _toPlaceSummaryDto(place: any, friendsReviewsCount = 0, avgRating?: number | null): PlaceSummaryDto {
        return {
            id: place.id,
            name: place.name,
            imageUrl: place.imageUrl,
            avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : 0,
            category: place.category.name,
            distanceInKm: 1.2,
            tag: place.tag,
            friendsReviewsCount,
        };
    }

    async getFriendsActivities(userId: number, page = 1, limit = 20) {
        const following = await this.prisma.follow.findMany({
            where: { followerId: userId },
            select: { followedId: true },
        });
        const friendIds = following.map((f) => f.followedId);
        if (friendIds.length === 0) {
            return {
                data: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                },
            };
        }
        const skip = (page - 1) * limit;
        const [total, activities] = await Promise.all([
            this.prisma.activity.count({
                where: { userId: { in: friendIds } },
            }),
            this.prisma.activity.findMany({
                where: { userId: { in: friendIds } },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, username: true, avatarUrl: true } },
                    place: { select: { id: true, name: true, imageUrl: true } },
                    review: { select: { id: true, generalRating: true } },
                    list: { select: { id: true, name: true } },
                },
            }),
        ]);
        const data = activities.map((act) => {
            let actionText = '';
            const placeName = act.place?.name || 'um lugar';
            switch (act.type) {
                case 'REVIEWED':
                    const rating = act.review?.generalRating;
                    if (rating) {
                        actionText = `avaliou ${placeName} com ${rating} estrelas`;
                    }
                    else {
                        actionText = `avaliou ${placeName}`;
                    }
                    break;
                case 'SAVED':
                    actionText = `salvou ${placeName}`;
                    break;
                case 'CHECKED_IN':
                    actionText = `fez check-in em ${placeName}`;
                    break;
                case 'CREATED_LIST':
                    actionText = `criou a lista "${act.list?.name || 'uma nova lista'}"`;
                    break;
                default:
                    actionText = 'realizou uma atividade.';
            }
            return {
                id: act.id,
                type: act.type,
                user: act.user,
                actionText: `${act.user.username || 'Um usuário'} ${actionText}`,
                timestamp: act.createdAt,
                place: act.place ? {
                    id: act.place.id,
                    name: act.place.name,
                    imageUrl: act.place.imageUrl,
                } : null,
                review: act.review ? {
                    id: act.review.id,
                    rating: act.review.generalRating,
                } : null,
                list: act.list ? {
                    id: act.list.id,
                    name: act.list.name,
                } : null,
            };
        });
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
