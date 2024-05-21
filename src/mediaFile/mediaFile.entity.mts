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

  @ManyToMany(() => Tag, (tags) => tags.mediaFiles, { onDelete: 'CASCADE' })
  tags: Tag[];

  constructor(md5, extension) {
    this.md5 = md5;
    this.extension = extension;
  }
}
