import { Injectable } from '@nestjs/common';
import { PlaceRatingsDto } from './dto/rating.dto';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class RatingsService {
    constructor(private prisma: PrismaService) { }
    async getRatingsForPlace(placeId: number, currentUserId?: number): Promise<PlaceRatingsDto> {
        const ratingStats = await this.prisma.review.aggregate({
            where: { placeId },
            _avg: {
                generalRating: true,
                foodRating: true,
                serviceRating: true,
                environmentRating: true,
            },
            _count: {
                generalRating: true,
            },
        });
        const formatAvg = (value: number | null | undefined): number => {
            return value ? parseFloat(value.toFixed(1)) : 0;
        };
        let friendsRating: number | null = null;
        if (currentUserId) {
            const followingIds = await this.prisma.follow
                .findMany({
                where: { followerId: currentUserId },
                select: { followedId: true },
            })
                .then((follows) => follows.map((f) => f.followedId));
            if (followingIds.length > 0) {
                const friendsRatingStats = await this.prisma.review.aggregate({
                    where: {
                        placeId,
                        userId: { in: followingIds },
                    },
                    _avg: {
                        generalRating: true,
                    },
                    _count: {
                        generalRating: true,
                    },
                });
                if (friendsRatingStats._count.generalRating &&
                    friendsRatingStats._count.generalRating > 0) {
                    friendsRating = formatAvg(friendsRatingStats._avg.generalRating);
                }
            }
        }
        return {
            overall: formatAvg(ratingStats._avg.generalRating),
            food: formatAvg(ratingStats._avg.foodRating),
            service: formatAvg(ratingStats._avg.serviceRating),
            ambiance: formatAvg(ratingStats._avg.environmentRating),
            totalReviews: ratingStats._count.generalRating || 0,
            friendsRating,
        };
    }
}
