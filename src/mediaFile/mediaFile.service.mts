import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from './mediaFile.entity.mjs';
import { fileTypeFromBuffer } from 'file-type';
import { Image } from 'src/image/image.interface.mjs';

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
    // const result = await this.findOneByMd5(md5);
    // console.log(result);
    // const ret = !!result;
    // console.log(ret);
    // return ret;
    return Boolean(await this.findOneByMd5(md5));
  }

  public async insert(image: Image) {
    // const md5hash = crypto.createHash('md5');
    // const md5 = md5hash.update(file).digest('hex');
    // const extension = await this.detectFileType(file);

    if (await this.isExist(image.md5)) {
      throw new Error('duplicate');
    }

    const mediaFile = this.mediaFileRepository.create({
      md5: image.md5,
      extension: image.extension,
    });

    await this.mediaFileRepository.insert(mediaFile);
  }

  private async detectFileType(file: Buffer): Promise<string> {
    const expectedFileType = ['jpg', 'png'];
    const fileTypeResult = await fileTypeFromBuffer(file);
    if (fileTypeResult === undefined) {
      throw new Error();
    }

    if (!expectedFileType.includes(fileTypeResult.ext)) {
      throw new Error('not image file');
    }
    return fileTypeResult.ext;
  }
}
