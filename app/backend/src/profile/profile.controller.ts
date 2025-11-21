import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UserId } from 'src/auth/decorators/auth-user.decorator';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { S3Service } from 'src/s3/s3.service';
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profile: ProfileService, private readonly s3: S3Service) { }
    @ApiOperation({ summary: 'Logged user profile' })
    @UseGuards(FirebaseAuthGuard)
    @Get('me')
    me(
    @UserId()
    userId: number) {
        return this.profile.getMyProfile(userId);
    }
    @ApiOperation({ summary: 'Get user profile by id' })
    @UseGuards(FirebaseAuthGuard)
    @Get(':userId')
    findOne(
    @Param('userId', ParseIntPipe)
    profileUserId: number, 
    @UserId()
    viewerUserId: number) {
        return this.profile.getProfileById(profileUserId, viewerUserId);
    }
    @ApiOperation({ summary: 'Lista lugares visitados por um usuário (distinct por lugar)' })
    @UseGuards(FirebaseAuthGuard)
    @Get(':userId/visited-places')
    visited(
    @Param('userId', ParseIntPipe)
    profileUserId: number) {
        return this.profile.getVisitedPlaces(profileUserId);
    }
    @ApiOperation({ summary: 'Lista wishlist (lugares salvos) de um usuário' })
    @UseGuards(FirebaseAuthGuard)
    @Get(':userId/wishlist')
    wishlist(
    @Param('userId', ParseIntPipe)
    profileUserId: number) {
        return this.profile.getWishlist(profileUserId);
    }
    @ApiOperation({ summary: 'Gera uma URL pré-assinada para upload de avatar' })
    @UseGuards(FirebaseAuthGuard)
    @Post('avatar/upload-url')
    getAvatarUploadUrl(
    @UserId()
    userId: number, 
    @Body('contentType')
    contentType: string) {
        return this.s3.getAvatarUploadUrl(userId, contentType || 'image/jpeg');
    }
    @ApiOperation({ summary: 'Atualiza a URL do avatar do usuário' })
    @UseGuards(FirebaseAuthGuard)
    @Put('avatar')
    async updateAvatar(
    @UserId()
    userId: number, 
    @Body('avatarUrl')
    avatarUrl: string) {
        return this.profile.updateAvatar(userId, avatarUrl);
    }
}
