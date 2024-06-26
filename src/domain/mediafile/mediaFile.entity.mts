import { Tag } from '../tag/tag.entity.mjs';
import {
  ManyToMany,
  Column,
  Entity,
  Unique,
  PrimaryColumn,
} from 'typeorm';
import { MediaFileId } from './media-file-id.mjs';

@Entity()
@Unique(['md5'])
export class MediaFile {
  @PrimaryColumn('varchar', {
    transformer: {
      from(value): MediaFileId {
        if (value === null) return;
        return new MediaFileId(value)
      },
      to(value: MediaFileId): string {
        return value.id
      }
    }
  })
  id: MediaFileId;

  @Column()
  md5: string;

  @Column()
  extension: string;

  @ManyToMany(() => Tag, (tags) => tags.mediaFiles)
  tags: Tag[];

  constructor(id: MediaFileId, md5: string, extension: string) {
    this.id = id
    this.md5 = md5;
    this.extension = extension;
  }
}
