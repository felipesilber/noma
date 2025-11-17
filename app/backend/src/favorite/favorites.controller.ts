import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseIntPipe, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UserId } from '../auth/decorators/auth-user.decorator';
import { FavoritePlaceService } from './favorites.service';
import { AddFavoriteDto } from './dto/add-favorite.dto';
@ApiTags('Favorite Places')
@UseGuards(FirebaseAuthGuard)
@Controller('favorite-places')
export class FavoritePlaceController {
    constructor(private readonly favoriteService: FavoritePlaceService) { }
    @ApiOperation({ summary: 'Lista todos os lugares favoritos do usuário' })
    @Get()
    listMyFavorites(
    @UserId()
    userId: number) {
        return this.favoriteService.listFavorites(userId);
    }
    @ApiOperation({ summary: 'Adiciona um lugar aos favoritos' })
    @ApiBody({ type: AddFavoriteDto })
    @Post()
    addFavorite(
    @UserId()
    userId: number, 
    @Body()
    dto: AddFavoriteDto) {
        return this.favoriteService.addFavorite(userId, dto.placeId);
    }
    @ApiOperation({ summary: 'Verifica se um lugar é favorito' })
    @ApiParam({ name: 'placeId', description: 'ID do lugar' })
    @Get(':placeId')
    checkFavorite(
    @UserId()
    userId: number, 
    @Param('placeId', ParseIntPipe)
    placeId: number) {
        return this.favoriteService.checkIsFavorite(userId, placeId);
    }
    @ApiOperation({ summary: 'Remove um lugar dos favoritos' })
    @ApiParam({ name: 'placeId', description: 'ID do lugar' })
    @Delete(':placeId')
    removeFavorite(
    @UserId()
    userId: number, 
    @Param('placeId', ParseIntPipe)
    placeId: number) {
        return this.favoriteService.removeFavorite(userId, placeId);
    }
}
