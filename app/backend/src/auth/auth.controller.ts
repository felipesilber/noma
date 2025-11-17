import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { CurrentUser, CurrentFirebaseUser } from './decorators/current-user.decorator';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @UseGuards(FirebaseAuthGuard)
    @Get('me')
    me(
    @CurrentUser()
    user: any, 
    @CurrentFirebaseUser()
    fUser: any) {
        return {
            id: user.id,
            firebaseUid: user.firebaseUid,
            name: user.name,
            email: user.email,
            emailVerified: fUser?.email_verified ?? false,
            provider: fUser?.firebase?.sign_in_provider ?? 'password',
        };
    }
    @UseGuards(FirebaseAuthGuard)
    @Post('login')
    async login(
    @Req()
    req) {
        return this.authService.validateOrCreateUser(req.user);
    }
}
