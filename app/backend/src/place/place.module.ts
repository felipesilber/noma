import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
@Module({
    imports: [PrismaModule, UserModule],
    controllers: [PlaceController],
    providers: [PlaceService],
})
export class PlaceModule {
}
