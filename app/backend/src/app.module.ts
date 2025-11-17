import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { FollowModule } from './follow/follow.module';
import { PlaceModule } from './place/place.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { SavedPlaceModule } from './saved-places/saved-places.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ListModule } from './list/list.module';
import { FeedModule } from './feed/feed.module';
import { RatingModule } from './rating/rating.module';
import { FavoriteModule } from './favorite/favorites.module';
import { HealthController } from './health/health.controller';
@Module({
  imports: [
    PrismaModule,
    PlaceModule,
    CategoryModule,
    ReviewModule,
    FollowModule,
    UserModule,
    SavedPlaceModule,
    AuthModule,
    ProfileModule,
    ListModule,
    FeedModule,
    RatingModule,
    FavoriteModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
