import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadService } from './image.upload.service.mjs';
import { type Image } from '../image.interface.mjs';
import { ImageUpload } from './image.upload.class.mjs';
import fs from 'node:fs/promises';

const filePath = 'test/files/image.png';
const file = await fs.readFile(filePath);

describe('ImageUploadService', () => {
  let service: ImageUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageUploadService],
    }).compile();

    service = module.get<ImageUploadService>(ImageUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('', async () => {
    await expect(service.parse(file)).resolves.not.toBeUndefined();
  });

  test('', async () => {
    await expect(service.parse(file)).resolves.toBeInstanceOf(ImageUpload);
  });

  test('', async () => {
    const ret = await service.parse(file);
    expect(ret.md5).toBe('80854f6deda157aecc1eaab3b44d3ece');
  });

  test('', async () => {
    const ret = await service.parse(file);
    expect(ret.extension).toBe('png');
  });

  test('throw Error if load text file not jpg, png', async () => {
    const textfile = await fs.readFile('test/files/textfile.txt');
    await expect(service.parse(textfile)).rejects.toThrowError();
  });
});
