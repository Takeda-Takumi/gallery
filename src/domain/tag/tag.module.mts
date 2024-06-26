import { Module } from '@nestjs/common';
import { TagService } from './tag.service.mjs';
import { TagRepositoryModule } from '../../infrastructure/sql/tag/tag.repository.module.mjs';

@Module({
  imports: [TagRepositoryModule],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule { }

