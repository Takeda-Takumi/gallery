import { Test, TestingModule } from '@nestjs/testing';
import fs from 'node:fs/promises';
import { MediaFileFactory } from './mediaFile.factory.mjs';

const filePath = 'test/files/image.png';
const file = await fs.readFile(filePath);

describe('MediaFileFactory', () => {
  let mediaFileFactory: MediaFileFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaFileFactory],
    }).compile();

    mediaFileFactory = module.get<MediaFileFactory>(MediaFileFactory);
  });

  test('', async () => {
    const ret = await mediaFileFactory.parse(file);
    expect(ret.md5).toBe('80854f6deda157aecc1eaab3b44d3ece');
    expect(ret.extension).toBe('png');
  });

  test('throw Error if load text file not jpg, png', async () => {
    const textfile = await fs.readFile('test/files/textfile.txt');
    await expect(mediaFileFactory.parse(textfile)).rejects.toThrowError();
  });
});
