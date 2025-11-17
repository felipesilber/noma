import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { FollowListController } from './follow-list.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
@Module({
    imports: [PrismaModule, UserModule],
    controllers: [FollowController, FollowListController],
    providers: [FollowService, PrismaService],
})
export class FollowModule {
}
