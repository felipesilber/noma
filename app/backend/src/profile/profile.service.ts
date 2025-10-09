import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type LastVisitedItem = {
  placeId: number;
  name: string;
  address: string | null;
  imageUrl: string | null;
  lastVisitAt: Date;
  rating: number | null;
  reviewId: number;
};

type ListPreviewItem = {
  placeId: number;
  name: string;
  imageUrl: string | null;
  order: number | null;
};

type ProfileResponse = {
  id: number;
  username: string | null;
  level: number;
  visitsCount: number;
  uniquePlacesCount: number;
  followersCount: number;
  followingCount: number;
  savedPlacesCount: number;
  lastVisited: LastVisitedItem[];
  lists: Array<{
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    itemsCount: number;
    preview: ListPreviewItem[];
  }>;
};

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(userId: number): Promise<ProfileResponse> {
    const [
      user,
      reviewsCount,
      recentReviews,
      lists,
      uniqueVisitedPlaceRows,
      followersCount,
      followingCount,
      savedPlacesCount,
    ] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, level: true },
      }),
      this.prisma.review.count({ where: { userId } }),
      this.prisma.review.findMany({
        where: { userId },
        include: {
          place: {
            select: { id: true, name: true, address: true, imageUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      this.prisma.list.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { items: true } },
          items: {
            include: {
              place: { select: { id: true, name: true, imageUrl: true } },
            },
            orderBy: [{ order: 'asc' }, { addedAt: 'desc' }],
            take: 4,
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 3,
      }),
      this.prisma.review.findMany({
        where: { userId },
        select: { placeId: true },
        distinct: ['placeId'],
      }),
      this.prisma.follow.count({ where: { followedId: userId } }),
      this.prisma.follow.count({ where: { followerId: userId } }),
      this.prisma.savedPlace.count({ where: { userId } }),
    ]);

    const seen = new Set<number>();
    const lastVisited: LastVisitedItem[] = [];
    for (const r of recentReviews) {
      if (!r.place) continue;
      if (seen.has(r.placeId)) continue;
      seen.add(r.placeId);
      lastVisited.push({
        placeId: r.placeId,
        name: r.place.name,
        address: r.place.address ?? null,
        imageUrl: r.place.imageUrl ?? null,
        lastVisitAt: r.createdAt,
        rating: (r as any).rating ?? null,
        reviewId: r.id,
      });
      if (lastVisited.length >= 10) break;
    }

    const listsOut = lists.map((l) => ({
      id: l.id,
      name: l.name,
      description: l.description ?? null,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
      itemsCount: l._count.items,
      preview: l.items.map((it) => ({
        placeId: it.placeId,
        name: it.place?.name ?? '',
        imageUrl: it.place?.imageUrl ?? null,
        order: it.order ?? null,
      })),
    }));

    return {
      id: user?.id ?? userId,
      username: user?.username ?? null,
      level: user?.level ?? 1,
      visitsCount: reviewsCount,
      uniquePlacesCount: uniqueVisitedPlaceRows.length,
      followersCount,
      followingCount,
      savedPlacesCount,
      lastVisited,
      lists: listsOut,
    };
  }
}
