import { Module } from '@nestjs/common';
import { AppController } from './app.controller.mjs';
import { AppService } from './app.service.mjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaFile } from './mediaFile/mediaFile.entity.mjs';
import { MediaFileModule } from './mediaFile/mediaFile.module.mjs';
import { Tag } from './tag/tag.entity.mjs';
import { TagModule } from './tag/tag.module.mjs';

@Module({
  imports: [
    MediaFileModule,
    TagModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/production.splite3',
      entities: [MediaFile, Tag],
      synchronize: true,
      logging: 'all',
      logger: 'file',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

