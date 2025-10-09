import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { SearchPlaceDto } from './dto/search-place.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { SearchPlaceByNameDto } from './dto/search-name.dto';

@ApiTags('Place')
@UseGuards(FirebaseAuthGuard)
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiOperation({ summary: 'Create a new place' })
  @ApiBody({
    description: 'Place Creation',
    type: CreatePlaceDto,
    examples: {
      exemplo1: {
        summary: 'Example',
        value: {
          name: 'Bar do Zé',
          description: 'Bar tradicional na zona sul',
          address: 'Rua das Flores, 123',
          categoryId: 1,
          phone: '(11) 99999-9999',
          siteUrl: 'https://exemplo.com',
          latitude: -23.55,
          longitude: -46.63,
          priceLevel: 'THREE',
          priceRange: 'R$ 40 - 60',
          tagNames: ['Hambúrguer', 'Custo-benefício'],
          photoUrls: ['https://picsum.photos/seed/1/800/600'],
        },
      },
    },
  })
  @Post()
  create(@Body() dto: CreatePlaceDto) {
    return this.placeService.create(dto);
  }

  @ApiOperation({ summary: 'Get all places' })
  @Get()
  findAll() {
    return this.placeService.findAll();
  }

  @ApiOperation({ summary: 'Get all places of a specific category' })
  @ApiParam({ name: 'categoryId', required: true, example: 1 })
  @Get('category/:categoryId')
  getByCategory(@Param('categoryId') categoryId: string) {
    return this.placeService.getByCategory(Number(categoryId));
  }

  @ApiOperation({ summary: 'Get all places visited by a user' })
  @ApiParam({ name: 'userId', required: true, example: 1 })
  @Get('visited/:userId')
  getVisitedByUser(@Param('userId') userId: string) {
    return this.placeService.getVisitedByUser(Number(userId));
  }

  @ApiOperation({ summary: 'Search places' })
  @Get('search')
  async search(@Query() dto: SearchPlaceByNameDto) {
    return this.placeService.search(dto.q, dto.limit);
  }

  @ApiOperation({ summary: 'Search places with filters' })
  @Get('search-filter')
  async searchFilter(@Query() dto: SearchPlaceDto) {
    return this.placeService.searchAdvanced(dto);
  }

  @ApiOperation({ summary: 'Get place details by id' })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiQuery({
    name: 'friendIds',
    required: false,
    description: 'Comma-separated friend userIds (e.g. 12,34,56)',
  })
  @Public()
  @Get(':id')
  async getDetails(
    @Param('id') id: string,
    @Query('friendIds') friendIds?: string,
  ) {
    const friends = friendIds
      ? friendIds
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => !isNaN(n))
      : undefined;

    return this.placeService.getDetails(Number(id), friends);
  }

  @ApiOperation({ summary: 'Delete all places' })
  @Public()
  @Delete()
  deleteAll() {
    return this.placeService.deleteAll();
  }

  @ApiOperation({ summary: 'Ranking semanal por nº de reviews' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Public()
  @Get('ranking/weekly')
  async rankingWeekly(@Query('limit') limit?: string) {
    const n = Number(limit) || 10;
    return this.placeService.topReviewedThisWeek(n);
  }
}
