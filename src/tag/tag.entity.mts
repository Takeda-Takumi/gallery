import { MediaFile } from '../mediaFile/mediaFile.entity.mjs';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ synchronize: true })
@Unique(['name'])
export class Tag {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => MediaFile, (mediaFile) => mediaFile.tags, {
    cascade: ['update'],
  })
  @JoinTable()
  mediaFiles: MediaFile[];

  // @OneToMany(() => Tagging, (tagging) => tagging.tag)
  // tagging: Tagging[];
}
