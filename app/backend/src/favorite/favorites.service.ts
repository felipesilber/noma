import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class FavoritePlaceService {
    constructor(private prisma: PrismaService) { }
    async addFavorite(userId: number, placeId: number) {
        try {
            const favorite = await this.prisma.favoritePlace.create({
                data: {
                    userId,
                    placeId,
                },
            });
            return favorite;
        }
        catch (e: any) {
            if (e?.code === 'P2002') {
                throw new BadRequestException('Este lugar já está nos seus favoritos.');
            }
            if (e?.code === 'P2003') {
                throw new NotFoundException('Usuário ou lugar não encontrado.');
            }
            throw e;
        }
    }
    async removeFavorite(userId: number, placeId: number) {
        try {
            await this.prisma.favoritePlace.delete({
                where: {
                    userId_placeId: {
                        userId,
                        placeId,
                    },
                },
            });
            return { ok: true, message: 'Favorito removido.' };
        }
        catch (e: any) {
            if (e?.code === 'P2025') {
                throw new NotFoundException('Este lugar não está nos seus favoritos.');
            }
            throw e;
        }
    }
    async listFavorites(userId: number) {
        const favorites = await this.prisma.favoritePlace.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                place: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        address: true,
                    },
                },
            },
        });
        return favorites.map((fav) => ({
            id: fav.place.id,
            name: fav.place.name,
            imageUrl: fav.place.imageUrl,
            address: fav.place.address,
            favoritedAt: fav.createdAt,
        }));
    }
    async checkIsFavorite(userId: number, placeId: number) {
        const count = await this.prisma.favoritePlace.count({
            where: {
                userId,
                placeId,
            },
        });
        return { isFavorite: count > 0 };
    }
}
