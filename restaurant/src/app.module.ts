import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './utils/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { MealModule } from './meal/meal.module';

console.log(process.env.NODE_ENV);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI_LOCAL),
    RestaurantModule,
    AuthModule,
    MealModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
