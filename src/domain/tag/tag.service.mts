import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity.mjs';
import { Repository } from 'typeorm';
import { TagName } from './tagName.mjs';
import { TagId } from './tagId.mjs';
import { MediaFile } from '../mediafile/mediaFile.entity.mjs';
import { TagRepository, TagRepositoryToken } from './tag.repository.interface.mjs';
import { TagAlreadyExistsInRepositoryException, TagIsNotFoundInRepositoryException } from './tag.exception.mjs';
import { MediaFileIsNotFoundInRepositoryException } from '../mediafile/mediaFile.exception.mjs';

@Injectable()
export class TagService {
  public constructor(
    @Inject(TagRepositoryToken)
    private readonly tagRepository: TagRepository,
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>,
  ) { }

  public async findOne(id: TagId): Promise<Tag> {
    return await this.tagRepository.findOneById(id);
  }

  public async create(name: TagName) {

    if (await this.tagRepository.findOneByName(name))
      throw new TagAlreadyExistsInRepositoryException();

    const newTag = new Tag(await this.tagRepository.nextIdentity(), name, [])

    return await this.tagRepository.save(newTag);
  }

  public async assignTag(tagId: TagId, mediaFileId: number) {
    if (!(await this.tagRepository.existsById(tagId)))
      throw new TagIsNotFoundInRepositoryException();
    if (!(await this.mediaFileRepository.exist({ where: { id: mediaFileId } })))
      throw new MediaFileIsNotFoundInRepositoryException();

    const tag: Tag = await this.tagRepository.findOneById(tagId);
    const mediaFile: MediaFile = await this.mediaFileRepository.findOne({
      where: {
        id: mediaFileId,
      },
    });

    const updatedTag = tag.assign(mediaFile)

    return await this.tagRepository.save(updatedTag);
  }

  public async changeName(tagId: TagId, newTagName: TagName): Promise<Tag> {
    if (!(await this.tagRepository.existsById(tagId))) {
      throw new TagIsNotFoundInRepositoryException();
    }
    if (await this.tagRepository.existsByName(newTagName))
      throw new TagAlreadyExistsInRepositoryException();

    const tag: Tag = await this.tagRepository.findOneById(tagId);

    const updateTag = tag.update(newTagName)

    return await this.tagRepository.save(updateTag)

  }


  public async remove(tagId: TagId, mediaFileId: number) {
    if (!(await this.tagRepository.existsById(tagId)))
      throw new TagIsNotFoundInRepositoryException();
    if (!(await this.mediaFileRepository.exist({ where: { id: mediaFileId } })))
      throw new MediaFileIsNotFoundInRepositoryException();

    const tag = await this.tagRepository.findOneById(tagId);

    const updatedTag = tag.remove(mediaFileId)

    return await this.tagRepository.save(updatedTag);
  }

  public async delete(tagId: TagId) {
    if (!(await this.tagRepository.existsById(tagId)))
      throw new TagIsNotFoundInRepositoryException();
    const tag = await this.tagRepository.findOneById(tagId);
    await this.tagRepository.remove(tag);
  }
}
