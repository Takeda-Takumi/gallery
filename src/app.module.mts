import { Module } from '@nestjs/common';
import { AppController } from './app.controller.mjs';
import { AppService } from './app.service.mjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaFile } from './mediaFile/mediaFile.entity.mjs';
import { MediaFileModule } from './mediaFile/mediaFile.module.mjs';

@Module({
  imports: [
    MediaFileModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/testdb.splite3',
      entities: [MediaFile],
      synchronize: true,
      logging: 'all',
      logger: 'file',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

