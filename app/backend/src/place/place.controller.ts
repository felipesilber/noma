import { Controller, Get, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PlaceService } from './place.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { FindPlacesDto } from './dto/find-places.dto';
import { UserId } from 'src/auth/decorators/auth-user.decorator';
@ApiTags('Place')
@Controller('places')
export class PlaceController {
    constructor(private readonly placeService: PlaceService) { }
    @ApiOperation({ summary: 'Busca, filtra e pagina uma lista de lugares' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: 'category', required: false, example: 'Hamburgueria' })
    @ApiQuery({ name: 'categoryId', required: false, example: 1 })
    @ApiQuery({
        name: 'sort',
        required: false,
        enum: ['popular', 'nearby', 'rating'],
    })
    @ApiQuery({ name: 'search', required: false, description: 'Termo de busca' })
    @Public()
    @Get()
    find(
    @Query()
    dto: FindPlacesDto) {
        return this.placeService.find(dto);
    }
    @ApiOperation({
        summary: 'Lista lugares de uma categoria visitados por amigos do usuário autenticado',
    })
    @ApiQuery({ name: 'category', required: false })
    @ApiQuery({ name: 'categoryId', required: false })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @UseGuards(FirebaseAuthGuard)
    @Get('by-category/friends')
    listByCategoryFriends(
    @UserId()
    userId: number, 
    @Query('category')
    category?: string, 
    @Query('categoryId')
    categoryId?: string, 
    @Query('page')
    page?: string, 
    @Query('limit')
    limit?: string) {
        return this.placeService.findByCategoryFriends(categoryId ? Number(categoryId) : (category as any), userId, page ? Number(page) : 1, limit ? Number(limit) : 10);
    }
    @ApiOperation({
        summary: 'Busca lugares por nome/endereço (para live search)',
    })
    @ApiQuery({
        name: 'q',
        required: true,
        description: 'Termo de busca (mínimo 2 caracteres)',
    })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @Public()
    @Get('search')
    searchByName(
    @Query('q')
    query: string, 
    @Query('limit')
    limit?: string) {
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        return this.placeService.searchByName(query, limitNumber);
    }
    @ApiOperation({ summary: 'Busca os detalhes completos de um lugar' })
    @ApiParam({ name: 'id', required: true, example: 1 })
    @UseGuards(FirebaseAuthGuard)
    @Get(':id')
    findOne(
    @Param('id')
    id: string, 
    @UserId()
    userId: number) {
        console.log(`[PlaceController] findOne placeId=${id} userId=${userId}`);
        return this.placeService.findOne(Number(id), userId);
    }
}
