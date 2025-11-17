import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
@Module({
    imports: [PrismaModule, UserModule],
    controllers: [ProfileController],
    providers: [ProfileService, PrismaService],
})
export class ProfileModule {
}
