import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FindPlacesDto, SearchByNameResultDto } from './dto/find-places.dto';
import { PlaceSummaryDto } from './dto/place.dto';
import { PlaceDetailsDto } from './dto/place-details.dto';
@Injectable()
export class PlaceService {
    constructor(private prisma: PrismaService) { }
    async searchByName(q: string, limit = 10): Promise<SearchByNameResultDto[]> {
        const term = q?.trim?.() || '';
        if (term.length < 2) {
            return [];
        }
        if (limit < 1 || limit > 30) {
            limit = 10;
        }
        const places = await this.prisma.place.findMany({
            where: {
                OR: [
                    { name: { contains: term, mode: 'insensitive' } },
                    { address: { contains: term, mode: 'insensitive' } },
                ],
            },
            take: limit,
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                address: true,
                imageUrl: true,
                photos: { select: { url: true }, take: 1 },
            },
        });
        const placeIds = places.map((p) => p.id);
        const ratingMap = await this._getAvgRatingsForPlaceIds(placeIds);
        return places.map((p) => {
            const avgRating = ratingMap.get(p.id);
            return {
                id: p.id,
                name: p.name,
                address: p.address,
                image: p.imageUrl || p.photos?.[0]?.url || null,
                avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
            };
        });
    }
    async find(dto: FindPlacesDto): Promise<{
        data: PlaceSummaryDto[];
        pagination: any;
    }> {
        const { page = 1 as any, limit = 10 as any, category, categoryId, sort, search, } = dto;
        const pageNum = Number(page) || 1;
        const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
        const where: Prisma.PlaceWhereInput = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { some: { name: { contains: search, mode: 'insensitive' } } } },
            ];
        }
        if (categoryId) {
            where.categoryId = Number(categoryId);
        }
        else if (category) {
            where.category = { name: { equals: category, mode: 'insensitive' } };
        }
        const orderBy: Prisma.PlaceOrderByWithRelationInput = sort === 'nearby' ? { name: 'asc' } : { name: 'asc' };
        const [total, places] = await this.prisma.$transaction([
            this.prisma.place.count({ where }),
            this.prisma.place.findMany({
                where,
                orderBy,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                include: {
                    category: { select: { name: true } },
                    _count: { select: { reviews: true } },
                    photos: { select: { url: true }, take: 1 },
                },
            }),
        ]);
        const placeIds = places.map((p) => p.id);
        const avgRatings = await this.prisma.review.groupBy({
            by: ['placeId'],
            where: { placeId: { in: placeIds } },
            _avg: { generalRating: true },
            orderBy: { placeId: 'asc' },
        });
        const ratingMap = new Map(avgRatings.map((r) => [r.placeId, r._avg.generalRating]));
        const data = places.map((place) => this._toPlaceSummaryDto(place, ratingMap.get(place.id)));
        return {
            data,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        };
    }
    async findByCategoryFriends(categoryOrName: string | number, currentUserId: number, page = 1, limit = 10): Promise<{
        data: PlaceSummaryDto[];
        pagination: any;
    }> {
        if (!categoryOrName && categoryOrName !== 0) {
            return { data: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
        const follows = await this.prisma.follow.findMany({
            where: { followerId: currentUserId },
            select: { followedId: true },
        });
        const followingIds = follows.map((f) => f.followedId);
        if (followingIds.length === 0) {
            return { data: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
        const where: Prisma.PlaceWhereInput = typeof categoryOrName === 'number'
            ? {
                categoryId: categoryOrName,
                reviews: { some: { userId: { in: followingIds } } },
            }
            : {
                category: {
                    name: { equals: String(categoryOrName), mode: 'insensitive' },
                },
                reviews: { some: { userId: { in: followingIds } } },
            };
        const [total, places] = await this.prisma.$transaction([
            this.prisma.place.count({ where }),
            this.prisma.place.findMany({
                where,
                orderBy: { name: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    category: { select: { name: true } },
                    _count: { select: { reviews: true } },
                    photos: { select: { url: true }, take: 1 },
                },
            }),
        ]);
        const placeIds = places.map((p) => p.id);
        const avgRatings = await this.prisma.review.groupBy({
            by: ['placeId'],
            where: { placeId: { in: placeIds } },
            _avg: { generalRating: true },
            orderBy: { placeId: 'asc' },
        });
        const ratingMap = new Map(avgRatings.map((r) => [r.placeId, r._avg.generalRating]));
        const data = places.map((place) => this._toPlaceSummaryDto(place, ratingMap.get(place.id)));
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id: number, currentUserId?: number): Promise<PlaceDetailsDto> {
        if (isNaN(id)) {
            throw new BadRequestException('ID do lugar inválido.');
        }
        const place = await this.prisma.place.findUnique({
            where: { id },
            include: {
                category: { select: { name: true } },
                tags: { select: { name: true } },
                photos: { select: { url: true } },
                openingHours: true,
                reviews: {
                    take: 2,
                    orderBy: { createdAt: 'desc' },
                    include: { user: { select: { username: true, avatarUrl: true } } },
                },
            },
        });
        if (!place) {
            throw new NotFoundException('Lugar não encontrado.');
        }
        const ratingStats = await this.prisma.review.aggregate({
            where: { placeId: id },
            _avg: {
                generalRating: true,
                foodRating: true,
                serviceRating: true,
                environmentRating: true,
            },
            _count: { _all: true },
        });
        const isSaved = currentUserId
            ? (await this.prisma.savedPlace.count({
                where: { placeId: id, userId: currentUserId },
            })) > 0
            : false;
        

        return this._toPlaceDetailsDto(place, ratingStats, isSaved);
    }
    private _toPlaceSummaryDto(place: any, avgRating?: number | null): PlaceSummaryDto {
        return {
            id: place.id,
            name: place.name,
            imageUrl: place.imageUrl || place.photos?.[0]?.url || null,
            avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : 0,
            distanceInKm: Math.random() * 5,
            priceRange: place.priceInfo,
        };
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
    private _toPlaceDetailsDto(place: any, ratingStats: any, isSaved: boolean): PlaceDetailsDto {
        return {
            id: place.id,
            name: place.name,
            category: place.category.name,
            imageUrls: [place.imageUrl, ...place.photos.map((p) => p.url)].filter(Boolean),
            isSaved,
            status: 'Aberto',
            priceInfo: place.priceInfo,
            address: place.address,
            distanceInKm: Math.random() * 5,
            ratings: {
                overall: parseFloat(ratingStats._avg.generalRating?.toFixed(1) || '0'),
                total: ratingStats._count._all,
                details: {
                    food: parseFloat(ratingStats._avg.foodRating?.toFixed(1) || '0'),
                    service: parseFloat(ratingStats._avg.serviceRating?.toFixed(1) || '0'),
                    ambiance: parseFloat(ratingStats._avg.environmentRating?.toFixed(1) || '0'),
                },
            },
            customerPhotos: place.photos.map((p) => p.url),
            reviews: place.reviews.map((r) => ({
                user: {
                    name: r.user.username || null,
                    avatarUrl: r.user.avatarUrl,
                },
                rating: r.generalRating,
                text: r.comment,
                createdAt: r.createdAt.toISOString(),
            })),
            coordinates: {
                latitude: place.latitude,
                longitude: place.longitude,
            },
            openingHours: place.openingHours.map((rule) => ({
                day: this._formatWeekday(rule.dayOfWeek),
                hours: `${rule.openTime} - ${rule.closeTime}`,
            })),
            tags: place.tags.map((t) => t.name),
        };
    }
    private _formatWeekday(day: string): string {
        const map = {
            MON: 'Segunda-feira',
            TUE: 'Terça-feira',
            WED: 'Quarta-feira',
            THU: 'Quinta-feira',
            FRI: 'Sexta-feira',
            SAT: 'Sábado',
            SUN: 'Domingo',
        };
        return map[day] || day;
    }
}
