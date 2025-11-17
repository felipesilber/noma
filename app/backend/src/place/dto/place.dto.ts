export class PlaceSummaryDto {
    id: number;
    name: string;
    imageUrl: string | null;
    avgRating: number;
    distanceInKm: number;
    priceRange: string | null;
}
