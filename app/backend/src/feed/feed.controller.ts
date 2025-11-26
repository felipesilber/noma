import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UserId } from 'src/auth/decorators/auth-user.decorator';
import { FeedService } from './feed.service';
@ApiTags('Feed')
@UseGuards(FirebaseAuthGuard)
@Controller('feed')
export class FeedController {
    constructor(private readonly feedService: FeedService) { }
    @ApiOperation({ summary: 'Busca os dados para a tela inicial do aplicativo' })
    @Get('home')
    getHomeFeed(
    @UserId()
    userId: number) {
        return this.feedService.getHomeFeed(userId);
    }

    @ApiOperation({ summary: 'Busca todas as atividades dos amigos do usuário' })
    @Get('friends-activities')
    getFriendsActivities(
        @UserId() userId: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.feedService.getFriendsActivities(userId, pageNum, limitNum);
    }
}
