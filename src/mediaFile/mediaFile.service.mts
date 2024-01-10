import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from './mediaFile.entity.mjs';

type Options = {
  md5?: string;
  id?: number;
};

@Injectable()
export class MediaFileService {
  constructor(
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>,
  ) {}

  public async findOne({
    md5 = undefined,
    id = undefined,
  }: Options): Promise<MediaFile> {
    return await this.mediaFileRepository.findOne({
      where: { md5: md5, id: id },
    });
  }

  public async isExist({
    md5 = undefined,
    id = undefined,
  }: Options): Promise<boolean> {
    return Boolean(await this.findOne({ md5: md5, id: id }));
  }

  public async insert(mediaFile: MediaFile) {
    if (await this.isExist({ md5: mediaFile.md5 })) {
      throw new Error('duplicate');
    }

    const newMediaFile = this.mediaFileRepository.create({
      md5: mediaFile.md5,
      extension: mediaFile.extension,
    });

    await this.mediaFileRepository.insert(newMediaFile);
  }
}
