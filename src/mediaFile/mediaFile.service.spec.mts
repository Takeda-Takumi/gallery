import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from './mediaFile.entity.mjs';
import { MediaFileService } from './mediaFile.service.mjs';
import { MediaFileRepositoryMock } from './mediaFile.repository.mock.mjs';

describe('MediafileService', () => {
  let service: MediaFileService;
  let mediaFileRepository: Repository<MediaFile>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaFileService,
        {
          provide: getRepositoryToken(MediaFile),
          useClass: MediaFileRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<MediaFileService>(MediaFileService);
    mediaFileRepository = module.get<Repository<MediaFile>>(
      getRepositoryToken(MediaFile),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test("findOne md5 'test'", async () => {
    await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
    const result = await service.findOne({ md5: 'test' });
    expect(result).not.toBeNull();
  });

  test('findOne md5 empty', async () => {
    await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
    const result = await service.findOne({ md5: '' });
    expect(result).toBeNull();
  });

  test('parameter md5 which is undefined return first element', async () => {
    const data1 = { md5: 'test1', extension: 'png' };
    const data2 = { md5: 'test2', extension: 'png' };

    await mediaFileRepository.insert(data1);
    await mediaFileRepository.insert(data2);
    expect(service.findOne({ md5: undefined })).resolves.toStrictEqual(data1);
  });

  test('find one by id', async () => {
    const data1 = { md5: 'test1', extension: 'png', id: 0 };
    const data2 = { md5: 'test2', extension: 'png', id: 1 };

    await mediaFileRepository.insert(data1);
    await mediaFileRepository.insert(data2);
    expect(service.findOne({ id: 1 })).resolves.toStrictEqual(data2);
  });

  test("id which dosen't exist returns null", async () => {
    const data1 = { md5: 'test1', extension: 'png', id: 0 };
    const data2 = { md5: 'test2', extension: 'png', id: 1 };

    await mediaFileRepository.insert(data1);
    await mediaFileRepository.insert(data2);
    expect(service.findOne({ id: 2 })).resolves.toBeNull();
  });

  test("md5 and id exist but data dosen't exist ", async () => {
    const data1 = { md5: 'test1', extension: 'png', id: 0 };
    const data2 = { md5: 'test2', extension: 'png', id: 1 };

    await mediaFileRepository.insert(data1);
    await mediaFileRepository.insert(data2);
    expect(service.findOne({ md5: 'test1', id: 1 })).resolves.toBeNull();
  });

  test('findOne md5 none', async () => {
    const result = await service.findOne({ md5: 'test' });
    expect(result).toBeNull();
  });

  test('exist md5 "test"', async () => {
    await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
    await expect(service.isExist({ md5: 'test' })).resolves.toBeTruthy();
  });

  test('not exist md5 "notExist"', async () => {
    await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
    await expect(service.isExist({ md5: 'notExist' })).resolves.toBeFalsy();
  });

  test('success insert', async () => {
    const fakeImage = new MediaFile('test', 'png');
    await expect(service.isExist({ md5: fakeImage.md5 })).resolves.toBeFalsy();
    await service.insert(fakeImage);
  });

  test('fail if same md5 exists', async () => {
    const fakeImage = new MediaFile('test', 'png');
    await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
    await expect(service.isExist({ md5: 'test' })).resolves.toBeTruthy();
    await expect(service.insert(fakeImage)).rejects.toThrow('duplicate');
  });
});
