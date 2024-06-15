import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaFile } from './mediaFile.entity.mjs';
import { MediaFileService } from './mediaFile.service.mjs';
import { MediaFileFactory } from './mediaFile.factory.mjs';
import { MulterModule } from '@nestjs/platform-express';
import { MediaFileController } from '../../presentation/http/controllers/mediafile/mediaFile.controller.mjs';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaFile]),
    MulterModule.register({
      limits: {
        fileSize: 30 * 1024 * 1024,
      },
    }),
  ],
  exports: [TypeOrmModule, MediaFileService, MediaFileFactory],
  providers: [MediaFileService, MediaFileFactory],
  controllers: [MediaFileController],
})
export class MediaFileModule { }

