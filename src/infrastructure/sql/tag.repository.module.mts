import { Module, Provider } from "@nestjs/common";
import { TypeOrmTagRepository } from "./tag.repository.typeorm.mjs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "../../domain/tag/tag.entity.mjs";
import { MediaFile } from "../../domain/mediafile/mediaFile.entity.mjs";
import { TagRepositoryToken } from "../../domain/tag/tag.repository.interface.mjs";

export const TagRepositoryProvider: Provider = {
  provide: TagRepositoryToken,
  useClass: TypeOrmTagRepository
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, MediaFile]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/production.splite3',
      entities: [MediaFile, Tag],
      synchronize: true,
      logging: 'all',
      logger: 'file',
    }),
  ],
  providers: [TagRepositoryProvider],
  exports: [TagRepositoryProvider, TypeOrmModule]
})
export class TagRepositoryModule { }
