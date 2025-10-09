import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../../prisma/prisma.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule],
  providers: [PrismaService, FirebaseAuthGuard, AuthService],
  exports: [FirebaseAuthGuard, AuthService],
})
export class AuthModule {}
