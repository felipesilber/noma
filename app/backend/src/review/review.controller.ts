import { Controller, Post, Get, Param, Body, UseGuards, Query, ParseIntPipe, } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserId } from 'src/auth/decorators/auth-user.decorator';
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }
    @ApiOperation({ summary: 'Cria uma nova avaliação para um lugar' })
    @UseGuards(FirebaseAuthGuard)
    @Post()
    create(
    @Body()
    createReviewDto: CreateReviewDto, 
    @UserId()
    userId: number) {
        return this.reviewService.create(userId, createReviewDto);
    }
    @ApiOperation({ summary: 'Busca todas as avaliações de um lugar específico' })
    @ApiParam({ name: 'placeId', required: true, example: 1 })
    @Public()
    @Get('by-place/:placeId')
    findByPlace(
    @Param('placeId')
    placeId: string) {
        return this.reviewService.findByPlace(Number(placeId));
    }
    @ApiOperation({ summary: 'Lista avaliações paginadas de um lugar (all/friends)' })
    @ApiParam({ name: 'placeId', required: true, example: 1 })
    @UseGuards(FirebaseAuthGuard)
    @Get('by-place/:placeId/list')
    listForPlace(
    @Param('placeId', ParseIntPipe)
    placeId: number, 
    @UserId()
    userId: number, 
    @Query('page')
    page?: string, 
    @Query('limit')
    limit?: string, 
    @Query('scope')
    scope?: 'all' | 'friends') {
        return this.reviewService.listForPlace(placeId, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            scope: scope === 'friends' ? 'friends' : 'all',
            viewerUserId: userId,
        });
    }
}
