import { Controller, Put, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { FollowService } from './follow.service';
import { UserId } from '../auth/decorators/auth-user.decorator';

@UseGuards(FirebaseAuthGuard)
@Controller('users/:targetId/follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Put()
  async follow(@Param('targetId') targetId: string, @UserId() userId: number) {
    await this.followService.follow(userId, Number(targetId));
    return { following: true };
  }

  @Delete()
  async unfollow(
    @Param('targetId') targetId: string,
    @UserId() userId: number,
  ) {
    await this.followService.unfollow(userId, Number(targetId));
    return { following: false };
  }

  @Get()
  async status(@Param('targetId') targetId: string, @UserId() userId: number) {
    const following = await this.followService.isFollowing(
      userId,
      Number(targetId),
    );
    return { following };
  }
}
