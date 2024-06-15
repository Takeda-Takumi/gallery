import { Module } from '@nestjs/common';
import { AppController } from './app.controller.mjs';
import { AppService } from './app.service.mjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaFileModule } from './domain/mediafile/mediaFile.module.mjs';
import { TagModule } from './domain/tag/tag.module.mjs';
import { MediaFile } from './domain/mediafile/mediaFile.entity.mjs';
import { Tag } from './domain/tag/tag.entity.mjs';
import { TagControllerModule } from './presentation/http/controllers/tag/tag.controller.module.mjs';

@Module({
  imports: [
    MediaFileModule,
    TagControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

