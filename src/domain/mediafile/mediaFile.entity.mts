import { Tag } from '../tag/tag.entity.mjs';
import {
  ManyToMany,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['md5'])
export class MediaFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  md5: string;

  @Column()
  extension: string;

  @ManyToMany(() => Tag, (tags) => tags.mediaFiles)
  tags: Tag[];

  constructor(id: number, md5: string, extension: string) {
    this.id = id
    this.md5 = md5;
    this.extension = extension;
  }
}
