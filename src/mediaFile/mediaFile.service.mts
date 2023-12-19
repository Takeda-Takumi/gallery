import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from './mediaFile.entity.mjs';

@Injectable()
export class MediaFileService {
  constructor(
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>,
  ) { }

  public async findOneByMd5(md5: string): Promise<MediaFile> {
    if (md5 === undefined) {
      throw Error('property md5 undefined');
    }

    return await this.mediaFileRepository.findOne({
      where: { md5: md5 },
    });
  }

  public async isExist(md5: string) {
    return Boolean(await this.findOneByMd5(md5));
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
