import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
