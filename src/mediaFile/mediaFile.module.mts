import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaFile } from './mediaFile.entity.mjs';
import { MediaFileService } from './mediaFile.service.mjs';

@Module({
  imports: [TypeOrmModule.forFeature([MediaFile])],
  exports: [TypeOrmModule, MediaFileService],
  providers: [MediaFileService],
})
export class MediaFileModule { }
