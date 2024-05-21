import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity.mjs';
import { TagService } from './tag.service.mjs';
import { MediaFile } from '../mediaFile/mediaFile.entity.mjs';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, MediaFile])],
  providers: [TagService],
  exports: [TypeOrmModule, TagService],
})
export class TagModule { }

