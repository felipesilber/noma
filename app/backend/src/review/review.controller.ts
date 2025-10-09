import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { UserId } from 'src/auth/decorators/auth-user.decorator';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Review a new place
  @ApiOperation({ summary: 'Review a new place' })
  @ApiBody({
      description: 'Review creation',
      type: CreateReviewDto,
      examples: {
        exemplo1: {
          summary: 'Example',
          value: {
            userId: 1,
            placeId: 3,
            rating: 5,
            price: 54.90,
            comment: 'Ótimo lugar, comida deliciosa!'
          },
        },
      },
    })
  @UseGuards(FirebaseAuthGuard)
  @Post('create')
  create(@Body() createReviewDto: CreateReviewDto, @UserId() userId: number) {
    return this.reviewService.create(userId, createReviewDto);
  }

  // Get all reviews
  @ApiOperation({ summary: 'Retornar todas críticas' })
  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  // Get all reviews from a specific user
  @ApiOperation({ summary: 'Get all reviews from a specific user' })
  @ApiParam({
      name: 'id',
      required: true,
      description: 'User Id',
      example: 1,
    })
  @UseGuards(FirebaseAuthGuard)    
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reviewService.findByUser(Number(userId));
  }

  // Get all reviews of a specific place
  @ApiOperation({ summary: 'Get all reviews of a specific place' })
  @ApiParam({
    name: 'placeId',
    required: true,
    description: 'Place Id',
    example: 1,
  })
  @Get('place/:placeId')
  findByPlace(@Param('placeId') placeId: string) {
    return this.reviewService.findByPlace(Number(placeId));
  }

  // Delete a specific review
  @ApiOperation({ summary: 'Delete a specific review' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Review Id',
    example: 1,
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reviewService.delete(Number(id));
  }

  // Delete all reviews
  @ApiOperation({ summary: 'Delete all reviews' })
  @Delete()
  deleteAll() {
    return this.reviewService.deleteAll();
  }
}
