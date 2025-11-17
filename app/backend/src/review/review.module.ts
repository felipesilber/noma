import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ReviewController } from './review.controller';
import { UserModule } from 'src/user/user.module';
@Module({
    imports: [PrismaModule, UserModule],
    controllers: [ReviewController],
    providers: [ReviewService],
})
export class ReviewModule {
}
