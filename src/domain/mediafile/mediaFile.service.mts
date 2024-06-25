import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from './mediaFile.entity.mjs';
import { MediaFileId } from './media-file-id.mjs';

type Options = {
  md5?: string;
  id?: MediaFileId;
};

@Injectable()
export class MediaFileService {
  constructor(
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>,
  ) { }

  public async findOne({
    md5 = undefined,
    id = undefined,
  }: Options): Promise<MediaFile> {
    return await this.mediaFileRepository.findOne({
      where: { md5: md5, id: id },
    });
  }

  public async exists({
    md5 = undefined,
    id = undefined,
  }: Options): Promise<boolean> {
    return Boolean(await this.findOne({ md5: md5, id: id }));
  }

  public async insert(md5: string, extension: string) {
    if (await this.exists({ md5: md5 })) {
      throw new Error('duplicate');
    }

    const newMediaFile = this.mediaFileRepository.create({
      md5: md5,
      extension: extension,
    });

    await this.mediaFileRepository.insert(newMediaFile);
  }

  public async remove(id: MediaFileId) {
    if (!(await this.exists({ id: id }))) throw new Error();

    const removed = await this.findOne({ id: id });
    await this.mediaFileRepository.remove(removed);
    return;
  }
}
