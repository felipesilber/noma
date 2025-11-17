import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserId } from '../auth/decorators/auth-user.decorator';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { PlaceRatingsDto } from './dto/rating.dto';
import { RatingsService } from './rating.service';
@ApiTags('Ratings')
@Controller('places')
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) { }
    @ApiOperation({ summary: 'Busca as notas agregadas de um lugar específico' })
    @ApiParam({ name: 'placeId', description: 'ID do Lugar', example: 1 })
    @UseGuards(FirebaseAuthGuard)
    @Get(':placeId/ratings')
    async getPlaceRatings(
    @Param('placeId', ParseIntPipe)
    placeId: number, 
    @UserId()
    userId?: number): Promise<PlaceRatingsDto> {
        return this.ratingsService.getRatingsForPlace(placeId, userId);
    }
}
