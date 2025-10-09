import { Controller, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { SavedPlaceService } from './saved-places.service';
import { UserId } from 'src/auth/decorators/auth-user.decorator';

@ApiTags('Saved Places')
@UseGuards(FirebaseAuthGuard)
@Controller('saved-places')
export class SavedPlaceController {
  constructor(private readonly savedPlaceService: SavedPlaceService) {}

  @ApiOperation({ summary: 'List my saved places' })
  @Get()
  listMine(@UserId() userId: number) {
    return this.savedPlaceService.listMine(userId);
  }

  @ApiOperation({ summary: 'Check if a place is saved' })
  @ApiParam({ name: 'placeId', example: 5 })
  @Get(':placeId')
  isSaved(@Param('placeId') placeId: string, @UserId() userId: number) {
    return this.savedPlaceService.isSaved(userId, Number(placeId));
  }

  @ApiOperation({ summary: 'Save a place' })
  @ApiParam({ name: 'placeId', example: 5 })
  @Put(':placeId')
  save(@Param('placeId') placeId: string, @UserId() userId: number) {
    return this.savedPlaceService.save(userId, Number(placeId));
  }

  @ApiOperation({ summary: 'Remove a saved place' })
  @ApiParam({ name: 'placeId', example: 5 })
  @Delete(':placeId')
  remove(@Param('placeId') placeId: string, @UserId() userId: number) {
    return this.savedPlaceService.remove(userId, Number(placeId));
  }
}
