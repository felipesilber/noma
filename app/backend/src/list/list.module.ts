import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from '../../prisma/prisma.module';
@Module({
    imports: [PrismaModule, UserModule],
    controllers: [ListController],
    providers: [ListService, PrismaService],
})
export class ListModule {
}
