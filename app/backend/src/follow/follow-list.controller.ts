import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UserId } from '../auth/decorators/auth-user.decorator';
import { FollowService } from './follow.service';
@UseGuards(FirebaseAuthGuard)
@Controller('users')
export class FollowListController {
    constructor(private readonly followService: FollowService) { }
    @Get(':userId/followers')
    async followers(
    @Param('userId', ParseIntPipe)
    userId: number, 
    @UserId()
    viewerUserId: number, 
    @Query('page')
    page?: string, 
    @Query('limit')
    limit?: string) {
        return this.followService.listFollowers(userId, viewerUserId, page ? Number(page) : 1, limit ? Number(limit) : 20);
    }
    @Get(':userId/following')
    async following(
    @Param('userId', ParseIntPipe)
    userId: number, 
    @UserId()
    viewerUserId: number, 
    @Query('page')
    page?: string, 
    @Query('limit')
    limit?: string) {
        return this.followService.listFollowing(userId, viewerUserId, page ? Number(page) : 1, limit ? Number(limit) : 20);
    }
}
