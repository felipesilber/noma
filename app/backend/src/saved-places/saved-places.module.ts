import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SavedPlaceController } from './saved-places.controller';
import { SavedPlaceService } from './saved-places.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [SavedPlaceController],
  providers: [SavedPlaceService, PrismaService],
})
export class SavedPlaceModule {}
