import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from './mediaFile.entity.mjs';

@Injectable()
export class MediaFileService {
  constructor(
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>,
  ) {}

  public async findOne(
    md5: string = undefined,
    id: number = undefined,
  ): Promise<MediaFile> {
    return await this.mediaFileRepository.findOne({
      where: { md5: md5, id: id },
    });
  }

  public async isExist(md5: string) {
    return Boolean(await this.findOne((md5 = md5)));
  }

  public async insert(mediaFile: MediaFile) {
    if (await this.isExist(mediaFile.md5)) {
      throw new Error('duplicate');
    }

    const newMediaFile = this.mediaFileRepository.create({
      md5: mediaFile.md5,
      extension: mediaFile.extension,
    });

    await this.mediaFileRepository.insert(newMediaFile);
  }
}
