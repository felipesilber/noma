class UserPreviewDto {
    name: string | null;
    avatarUrl: string | null;
}
class ReviewPreviewDto {
    user: UserPreviewDto;
    rating: number;
    text: string | null;
    createdAt: string;
}
class CoordinatesDto {
    latitude: number;
    longitude: number;
}
class OpeningHoursRuleDto {
    day: string;
    hours: string;
}
class RatingDetailsDto {
    food: number;
    service: number;
    ambiance: number;
}
class RatingsDto {
    overall: number;
    total: number;
    details: RatingDetailsDto;
}
export class PlaceDetailsDto {
    id: number;
    name: string;
    category: string;
    imageUrls: string[];
    isSaved: boolean;
    status: string;
    priceInfo: string | null;
    address: string;
    distanceInKm: number;
    ratings: RatingsDto;
    customerPhotos: string[];
    reviews: ReviewPreviewDto[];
    coordinates: CoordinatesDto;
    openingHours: OpeningHoursRuleDto[];
    tags: string[];
}
