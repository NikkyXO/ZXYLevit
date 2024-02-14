import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeModule } from './modules/stripe/stripe.module';

@Module({
  imports: [AuthModule, DatabaseModule, UserModule, StripeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
