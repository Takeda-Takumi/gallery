import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity.mjs';
import { Repository } from 'typeorm';
import { MediaFile } from '../mediaFile/mediaFile.entity.mjs';
import { TagDTO } from './tag.dto.mjs';

@Injectable()
export class TagService {
  public constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>,
  ) { }

  public async exists(tagId: number): Promise<boolean> {
    return await this.tagRepository.exist({ where: { id: tagId } });
  }

  public async existsByName(name: string) {
    return await this.tagRepository.exist({ where: { name: name } });
  }

  public async findOne({
    name = undefined,
    id = undefined,
  }: {
    name?: string;
    id?: number;
  }): Promise<Tag> {
    return await this.tagRepository.findOne({
      relations: { mediaFiles: { tags: true } },
      where: { name: name, id: id },
    });
  }

  public async create(data: TagDTO) {
    const { name } = data;

    if (await this.tagRepository.findOne({ where: { name: name } }))
      throw new Error();

    await this.tagRepository.save(data);
    return;
  }

  public async assignTag(tagId: number, mediaFileId: number) {
    if (!(await this.exists(tagId))) throw new Error();
    if (!(await this.mediaFileRepository.exist({ where: { id: mediaFileId } })))
      throw new Error();

    const tag: Tag = await this.tagRepository.findOne({
      relations: { mediaFiles: true },
      where: { id: tagId },
    });
    const mediaFile: MediaFile = await this.mediaFileRepository.findOne({
      relations: { tags: true },
      where: {
        id: mediaFileId,
      },
    });

    const updatedTag = this.tagRepository.create({
      id: tag.id,
      name: tag.name,
      mediaFiles: [...tag.mediaFiles, mediaFile],
    });
    return await this.tagRepository.save(updatedTag);
  }

  public async updateTagName(previousTagName: string, newTagName: string) {
    if (!(await this.existsByName(previousTagName))) {
      throw new Error();
    }

    if (await this.existsByName(newTagName)) throw new Error();

    await this.tagRepository.update(
      { name: previousTagName },
      { name: newTagName },
    );
  }

  public async remove(tagId: number, mediaFileId: number) {
    if (!(await this.tagRepository.exist({ where: { id: tagId } })))
      throw new Error();
    if (!(await this.mediaFileRepository.exist({ where: { id: mediaFileId } })))
      throw new Error();

    const tag = await this.tagRepository.findOne({
      relations: { mediaFiles: true },
      where: {
        id: tagId,
      },
    });

    if (!tag.mediaFiles.find((value) => value.id === mediaFileId))
      throw new Error();

    const updatedMediaFile = tag.mediaFiles.filter((mediaFile) => {
      return mediaFile.id !== mediaFileId;
    });

    const updatedTag = this.tagRepository.create({
      id: tag.id,
      name: tag.name,
      mediaFiles: updatedMediaFile,
    });

    await this.tagRepository.save(updatedTag);
  }

  public async delete(tagId: number) {
    if (!(await this.exists(tagId))) throw new Error();
    const tag = await this.tagRepository.findOne({
      relations: { mediaFiles: true },
      where: { id: tagId },
    });
    await this.tagRepository.remove(tag);
  }
}
