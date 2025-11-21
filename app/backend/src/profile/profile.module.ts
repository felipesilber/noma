import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { S3Service } from 'src/s3/s3.service';
@Module({
    imports: [PrismaModule, UserModule],
    controllers: [ProfileController],
    providers: [ProfileService, PrismaService, S3Service],
})
export class ProfileModule {
}
