class PlaceCarouselItemDto {
    id: number;
    name: string;
    imageUrl: string | null;
}
class UserListDto {
    id: number;
    name: string;
    imageUrl: string | null;
    isRanking: boolean;
}
export class UserProfileDto {
    id: number;
    username: string | null;
    avatarUrl: string | null;
    joinDate: string;
    isFollowing?: boolean;
    stats: {
        followersCount: number;
        followingCount: number;
        visitedPlacesCount: number;
        wishlistCount: number;
    };
    nomaStatus: {
        level: number;
        currentXp: number;
        nextLevelXp: number;
    };
    dashboardStats: {
        favoriteCuisine: string;
        mostFrequentRating: number;
        avgReviewsPerWeek: number;
    };
    carousels: {
        favoritePlaces: PlaceCarouselItemDto[];
        recentlyVisitedPlaces: PlaceCarouselItemDto[];
        userLists: UserListDto[];
    };
}
