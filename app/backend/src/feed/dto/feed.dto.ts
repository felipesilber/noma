export class PlaceSummaryDto {
    id: number;
    name: string;
    imageUrl: string;
    avgRating: number;
    category: string;
    distanceInKm: number;
    tag?: string;
}
export class FriendActivityDto {
    user: {
        username: string | null;
        avatarUrl: string | null;
    };
    actionText: string;
    timestamp: Date;
}
export class EventDto {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    place: {
        id: number;
        name: string;
    };
}
export class HomeFeedDto {
    featuredPlaces: PlaceSummaryDto[];
    recommendedPlaces: PlaceSummaryDto[];
    friendActivityPreview: FriendActivityDto[];
    events: EventDto[];
}
