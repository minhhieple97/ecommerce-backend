import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurations from './configs/configurations';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configurations] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
  }
}
