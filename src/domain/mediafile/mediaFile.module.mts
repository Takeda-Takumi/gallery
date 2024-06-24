import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaFile } from './mediaFile.entity.mjs';
import { MediaFileService } from './mediaFile.service.mjs';
import { MediaFileFactory } from './mediaFile.factory.mjs';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaFile]),
  ],
  exports: [TypeOrmModule, MediaFileService, MediaFileFactory],
  providers: [MediaFileService, MediaFileFactory],
})
export class MediaFileModule { }

