import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
@Module({
    imports: [PrismaModule, UserModule],
    controllers: [FeedController],
    providers: [FeedService, PrismaService],
})
export class FeedModule {
}
