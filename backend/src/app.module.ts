import { Module } from '@nestjs/common';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AuthModule } from './auth/auth.module';
import { FaqModule } from './faq/faq.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    FaqModule,
    AnnouncementsModule,
  ],
})
export class AppModule {}
