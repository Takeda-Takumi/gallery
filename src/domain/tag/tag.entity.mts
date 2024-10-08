import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { TagName } from './tagName.mjs';
import { TagId } from './tagId.mjs';
import { MediaFile } from '../mediafile/mediaFile.entity.mjs';
import { AlreadyAssignedException, NotAssignedException } from './tag.exception.mjs';
import { MediaFileId } from '../mediafile/media-file-id.mjs';

@Entity({ synchronize: true })
@Unique(['name'])
export class Tag {

  @PrimaryColumn('uuid', { transformer: { from(value): TagId { return new TagId(value) }, to(val: TagId): string { return val.id } } })
  readonly id: TagId;

  @Column('varchar', { transformer: { from(value): TagName { return new TagName(value) }, to(value: TagName): string { return value.name } } })
  readonly name: TagName;

  @ManyToMany(() => MediaFile, (mediaFile) => mediaFile.tags, {
    cascade: true,
  })
  @JoinTable()
  readonly mediaFiles: MediaFile[];

  getIdAsString() {
    return this.id.id
  }

  public constructor(id: TagId, name: TagName, mediaFiles: MediaFile[]) {
    this.id = id
    this.name = name;
    this.mediaFiles = mediaFiles
  }

  public assign(mediaFile: MediaFile) {
    if (this.mediaFiles.find((value) => value.id.id === mediaFile.id.id))
      throw new AlreadyAssignedException();
    return new Tag(this.id, this.name, [...this.mediaFiles, mediaFile])
  }

  public static create(name: string, mediaFiles?: MediaFile[]) {
    return new Tag(null, new TagName(name), mediaFiles)
  }

  public update(name: TagName) {
    return new Tag(this.id, name, this.mediaFiles)
  }

  public remove(mediaFileId: MediaFileId) {
    if (!this.mediaFiles.find((value) => value.id.id === mediaFileId.id))
      throw new NotAssignedException();

    const updatedMediaFiles = this.mediaFiles.filter((mediaFile) => {
      return mediaFile.id.id !== mediaFileId.id;
    });

    return new Tag(this.id, this.name, updatedMediaFiles)
  }
}
