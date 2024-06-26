import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from './mediaFile.entity.mjs';
import { MediaFileId } from './media-file-id.mjs';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class MediaFileService {
  constructor(
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>,
  ) { }

  public async findOneById(id: MediaFileId) {
    return await this.mediaFileRepository.findOne({ where: { id: id } })
  }

  public async findOneByHash(hash: string) {
    return await this.mediaFileRepository.findOne({ where: { md5: hash } })
  }

  public async insert(md5: string, extension: string) {
    if (await this.mediaFileRepository.exist({ where: { md5: md5 } })) {
      throw new Error('duplicate');
    }

    const newMediaFile = this.mediaFileRepository.create({
      id: new MediaFileId(uuidv4()),
      md5: md5,
      extension: extension,
    });

    return await this.mediaFileRepository.save(newMediaFile);
  }

  public async remove(id: MediaFileId) {
    if (!(await this.mediaFileRepository.exist({ where: { id: id } }))) throw new Error();

    const removed = await this.findOneById(id);
    await this.mediaFileRepository.remove(removed);
  }
}
