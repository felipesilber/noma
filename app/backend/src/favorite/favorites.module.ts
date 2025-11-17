import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FavoritePlaceService } from './favorites.service';
import { FavoritePlaceController } from './favorites.controller';
import { UserModule } from 'src/user/user.module';
@Module({
    imports: [PrismaModule, UserModule],
    controllers: [FavoritePlaceController],
    providers: [FavoritePlaceService],
    exports: [FavoritePlaceService],
})
export class FavoriteModule {
}
