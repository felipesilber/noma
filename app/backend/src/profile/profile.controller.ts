import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UserId } from 'src/auth/decorators/auth-user.decorator';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @ApiOperation({ summary: 'Logged user profile' })
  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  me(@UserId() userId: number) {
    return this.profile.getMyProfile(userId);
  }
}
