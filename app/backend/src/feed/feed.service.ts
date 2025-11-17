import { Injectable } from '@nestjs/common';
import { HomeFeedDto, PlaceSummaryDto } from './dto/feed.dto';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class FeedService {
    constructor(private prisma: PrismaService) { }
    async getHomeFeed(userId: number): Promise<HomeFeedDto> {
        const [featuredPlaces, recommendedPlaces, friendActivityPreview, events] = await Promise.all([
            this._getFeaturedPlaces(),
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
    private async _getFeaturedPlaces(): Promise<PlaceSummaryDto[]> {
        const places = await this.prisma.place.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { category: true },
        });
        return places.map((p) => this._toPlaceSummaryDto(p));
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
            return this._getFeaturedPlaces();
        const places = await this.prisma.place.findMany({
            take: 5,
            include: { category: true },
        });
        return places.map((p) => this._toPlaceSummaryDto(p));
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
    private _toPlaceSummaryDto(place: any): PlaceSummaryDto {
        return {
            id: place.id,
            name: place.name,
            imageUrl: place.imageUrl,
            avgRating: 4.5,
            category: place.category.name,
            distanceInKm: 1.2,
            tag: place.tag,
        };
    }
}
