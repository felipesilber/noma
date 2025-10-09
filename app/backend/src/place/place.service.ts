import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { priceToSymbols } from '../shared/utils/utils';
import { Prisma } from '@prisma/client';
import { SearchPlaceDto } from './dto/search-place.dto';

type AvgBundle = {
  avgRating?: number;
  avgFood?: number;
  avgService?: number;
  avgEnvironment?: number;
};

@Injectable()
export class PlaceService {
  constructor(private prisma: PrismaService) {}

  private toFixed1OrUndef(n: number | null | undefined) {
    return typeof n === 'number' ? Number(n.toFixed(1)) : undefined;
  }

  private async getAvgRatingsFor(placeIds: number[]) {
    if (!placeIds.length) return new Map<number, AvgBundle>();
    const groups = await this.prisma.review.groupBy({
      by: ['placeId'],
      where: { placeId: { in: placeIds } },
      _avg: {
        generalRating: true,
        foodRating: true,
        serviceRating: true,
        environmentRating: true,
      },
    });
    const avgMap = new Map<number, AvgBundle>();
    for (const g of groups) {
      avgMap.set(g.placeId, {
        avgRating: this.toFixed1OrUndef(g._avg?.generalRating as number),
        avgFood: this.toFixed1OrUndef(g._avg?.foodRating as number),
        avgService: this.toFixed1OrUndef(g._avg?.serviceRating as number),
        avgEnvironment: this.toFixed1OrUndef(
          g._avg?.environmentRating as number,
        ),
      });
    }
    return avgMap;
  }

  create(createPlaceDto: CreatePlaceDto) {
    const { tagNames, photoUrls, ...data } = createPlaceDto;
    return this.prisma.place.create({
      data: {
        ...data,
        ...(tagNames?.length
          ? {
              tags: {
                connectOrCreate: tagNames.map((name) => ({
                  where: { name },
                  create: { name },
                })),
              },
            }
          : {}),
        ...(photoUrls?.length
          ? {
              photos: {
                create: photoUrls.map((url) => ({ url })),
              },
            }
          : {}),
      },
      include: { tags: true, photos: true },
    });
  }

  async findAll() {
    const places = await this.prisma.place.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        imageUrl: true,
        category: { select: { name: true } },
        priceLevel: true,
        photos: { select: { url: true }, take: 1 },
      },
      orderBy: { name: 'asc' },
    });

    const ids = places.map((p) => p.id);
    const avgMap = await this.getAvgRatingsFor(ids);

    return places.map((p) => {
      const bundle = avgMap.get(p.id) ?? {};
      return {
        id: p.id,
        name: p.name,
        address: p.address,
        image: p.imageUrl || p.photos?.[0]?.url || null,
        category: p.category?.name ?? null,
        priceLevel: p.priceLevel ?? null,
        avgRating: bundle.avgRating,
        avgFood: bundle.avgFood,
        avgService: bundle.avgService,
        avgEnvironment: bundle.avgEnvironment,
      };
    });
  }

  getByCategory(categoryId: number) {
    return this.prisma.place.findMany({
      where: { categoryId },
    });
  }

  async getVisitedByUser(userId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      select: { placeId: true },
    });

    const placeIds = reviews.map((r) => r.placeId);

    return this.prisma.place.findMany({
      where: {
        id: { in: placeIds },
      },
    });
  }

  async searchAdvanced(dto: SearchPlaceDto) {
    const {
      q,
      categoryIds,
      categoryNames,
      tagIds,
      tagNames,
      priceLevels,
      page = 1,
      limit = 10,
      sort = 'name_asc',
    } = dto;

    const and: Prisma.PlaceWhereInput[] = [];

    if (q && q.trim()) {
      const term = q.trim();
      and.push({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { address: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      });
    }

    if (categoryIds?.length) and.push({ categoryId: { in: categoryIds } });
    if (categoryNames?.length) {
      and.push({
        category: { name: { in: categoryNames, mode: 'insensitive' } },
      });
    }
    if (tagIds?.length) and.push({ tags: { some: { id: { in: tagIds } } } });
    if (tagNames?.length) {
      and.push({
        tags: { some: { name: { in: tagNames, mode: 'insensitive' } } },
      });
    }
    if (priceLevels?.length)
      and.push({ priceLevel: { in: priceLevels as any } });

    const where: Prisma.PlaceWhereInput = and.length ? { AND: and } : {};

    let orderBy:
      | Prisma.PlaceOrderByWithRelationInput
      | Prisma.PlaceOrderByWithRelationInput[] = { name: 'asc' };
    switch (sort) {
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      case 'price_asc':
        orderBy = { priceLevel: 'asc' };
        break;
      case 'price_desc':
        orderBy = { priceLevel: 'desc' };
        break;
      case 'rating_desc':
        orderBy = { name: 'asc' };
        break;
      case 'name_asc':
      default:
        orderBy = { name: 'asc' };
    }

    const [total, rawPlaces] = await this.prisma.$transaction([
      this.prisma.place.count({ where }),
      this.prisma.place.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          address: true,
          imageUrl: true,
          category: { select: { id: true, name: true } },
          priceLevel: true,
          tags: { select: { id: true, name: true } },
          photos: { select: { url: true }, take: 1 },
        },
      }),
    ]);

    const ids = rawPlaces.map((p) => p.id);
    const avgMap = await this.getAvgRatingsFor(ids);

    const data = rawPlaces.map((p) => {
      const bundle = avgMap.get(p.id) ?? {};
      return {
        id: p.id,
        name: p.name,
        address: p.address,
        image: p.imageUrl || p.photos?.[0]?.url || null,
        category: p.category?.name || null,
        priceLevel: p.priceLevel || null,
        tags: p.tags?.map((t) => t.name) || [],
        avgRating: bundle.avgRating,
        avgFood: bundle.avgFood,
        avgService: bundle.avgService,
        avgEnvironment: bundle.avgEnvironment,
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

  async search(q: string, limit = 10) {
    const term = q?.trim?.() || '';
    if (!term) throw new BadRequestException('Informe o termo para busca.');

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

    const ids = places.map((p) => p.id);
    const avgMap = await this.getAvgRatingsFor(ids);

    return places.map((p) => {
      const bundle = avgMap.get(p.id) ?? {};
      return {
        id: p.id,
        name: p.name,
        address: p.address,
        image: p.imageUrl || p.photos?.[0]?.url || null,
        avgRating: bundle.avgRating,
        avgFood: bundle.avgFood,
        avgService: bundle.avgService,
        avgEnvironment: bundle.avgEnvironment,
      };
    });
  }

  deleteAll() {
    return this.prisma.place.deleteMany();
  }

  async getDetails(id: number, friendIds?: number[]) {
    const place = await this.prisma.place.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        tags: { select: { name: true } },
        openingHours: {
          select: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
            statusNow: true,
            closesAt: true,
            opensAt: true,
          },
        },
        reviews: {
          select: {
            generalRating: true,
            foodRating: true,
            serviceRating: true,
            environmentRating: true,
            userId: true,
            user: { select: { id: true, avatarUrl: true } },
          },
        },
        photos: { select: { url: true }, take: 1 },
      },
    });

    if (!place) throw new NotFoundException('Place not found');

    const gen = place.reviews
      ?.map((r) => r.generalRating)
      .filter((n) => typeof n === 'number') as number[];
    const food = place.reviews
      ?.map((r) => r.foodRating)
      .filter((n) => typeof n === 'number') as number[];
    const serv = place.reviews
      ?.map((r) => r.serviceRating)
      .filter((n) => typeof n === 'number') as number[];
    const env = place.reviews
      ?.map((r) => r.environmentRating)
      .filter((n) => typeof n === 'number') as number[];

    const avg = (arr: number[]) =>
      arr.length
        ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1))
        : undefined;

    const avgRating = avg(gen);
    const avgFood = avg(food);
    const avgService = avg(serv);
    const avgEnvironment = avg(env);

    let friendsRating: number | undefined = undefined;
    let friendsFood: number | undefined = undefined;
    let friendsService: number | undefined = undefined;
    let friendsEnvironment: number | undefined = undefined;
    let visitedByFriends: Array<{ id: string; avatar: string }> = [];

    if (friendIds?.length) {
      const friendReviews = place.reviews.filter((r) =>
        friendIds.includes(r.userId),
      );

      const fGen = friendReviews
        .map((r) => r.generalRating)
        .filter((n) => typeof n === 'number') as number[];
      const fFood = friendReviews
        .map((r) => r.foodRating)
        .filter((n) => typeof n === 'number') as number[];
      const fServ = friendReviews
        .map((r) => r.serviceRating)
        .filter((n) => typeof n === 'number') as number[];
      const fEnv = friendReviews
        .map((r) => r.environmentRating)
        .filter((n) => typeof n === 'number') as number[];

      friendsRating = avg(fGen);
      friendsFood = avg(fFood);
      friendsService = avg(fServ);
      friendsEnvironment = avg(fEnv);

      visitedByFriends = friendReviews
        .filter((r) => r.user?.id)
        .map((r) => ({
          id: String(r.user!.id),
          avatar:
            r.user?.avatarUrl || 'https://picsum.photos/seed/friend/200/200',
        }));
    }

    const oh = place.openingHours;
    const openingHours = oh
      ? {
          status: oh.statusNow ? 'Aberto' : 'Fechado',
          closesAt: oh.closesAt || undefined,
          opensAt: oh.opensAt || undefined,
          details: [
            oh.monday ? `Segunda: ${oh.monday}` : undefined,
            oh.tuesday ? `Terça: ${oh.tuesday}` : undefined,
            oh.wednesday ? `Quarta: ${oh.wednesday}` : undefined,
            oh.thursday ? `Quinta: ${oh.thursday}` : undefined,
            oh.friday ? `Sexta: ${oh.friday}` : undefined,
            oh.saturday ? `Sábado: ${oh.saturday}` : undefined,
            oh.sunday ? `Domingo: ${oh.sunday}` : undefined,
          ].filter(Boolean) as string[],
        }
      : undefined;

    return {
      id: place.id,
      name: place.name,
      category: place.category?.name,
      address: place.address,
      phone: place.phone || undefined,
      image: place.photos?.[0]?.url || undefined,
      tags: place.tags?.map((t) => t.name) || [],
      avgRating,
      avgFood,
      avgService,
      avgEnvironment,
      friendsRating,
      friendsFood,
      friendsService,
      friendsEnvironment,
      priceLevel: priceToSymbols(place.priceLevel) || undefined,
      priceRange: place.priceRange || undefined,
      visitedByFriends,
      openingHours,
    };
  }

  async topReviewedThisWeek(limit = 10) {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const args = {
      where: { createdAt: { gte: since } },
      by: ['placeId'] as const,
      _count: { placeId: true },
      _avg: { generalRating: true },
      orderBy: { _count: { placeId: 'desc' } },
      take: limit,
    } satisfies Prisma.ReviewGroupByArgs;

    const groups = await this.prisma.review.groupBy(args);
    if (!groups.length) return [];

    const placeIds = groups.map((g) => g.placeId);
    const places = await this.prisma.place.findMany({
      where: { id: { in: placeIds } },
      select: {
        id: true,
        name: true,
        address: true,
        imageUrl: true,
        category: { select: { name: true } },
        photos: { select: { url: true }, take: 1 },
      },
    });
    const byId = new Map(places.map((p) => [p.id, p]));

    return groups.map((g, idx) => {
      const p = byId.get(g.placeId);
      const reviewsThisWeek = g._count?.placeId ?? 0;
      const avg = g._avg?.generalRating ?? null;

      return {
        rank: idx + 1,
        id: g.placeId,
        name: p?.name ?? '',
        address: p?.address ?? null,
        category: p?.category?.name ?? null,
        image: p?.imageUrl || p?.photos?.[0]?.url || null,
        reviewsThisWeek,
        avgRatingThisWeek: avg === null ? null : Number(avg.toFixed(1)),
      };
    });
  }
}
