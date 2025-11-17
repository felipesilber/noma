import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RatingsController } from './rating.controller';
import { RatingsService } from './rating.service';
import { UserModule } from 'src/user/user.module';
@Module({
    imports: [PrismaModule, UserModule],
    controllers: [RatingsController],
    providers: [RatingsService],
    exports: [RatingsService],
})
export class RatingModule {
}
