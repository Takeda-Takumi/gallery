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
    const result = await service.findOneByMd5('test');
    expect(result).not.toBeNull();
  });

  test('findOne md5 empty', async () => {
    await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
    const result = await service.findOneByMd5('');
    expect(result).toBeNull();
  });

  test('findOne md5 undefined', async () => {
    await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
    expect(service.findOneByMd5(undefined)).rejects.toThrow(
      'property md5 undefined',
    );
  });

  test('findOne md5 none', async () => {
    const result = await service.findOneByMd5('test');
    expect(result).toBeNull();
  });

  test('exist md5 "test"', async () => {
    await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
    await expect(service.isExist('test')).resolves.toBeTruthy();
  });

  test('not exist md5 "notExist"', async () => {
    await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
    await expect(service.isExist('notExist')).resolves.toBeFalsy();
  });

  test('success insert', async () => {
    const fakeImage = new MediaFile('test', 'png');
    await expect(service.isExist(fakeImage.md5)).resolves.toBeFalsy();
    await service.insert(fakeImage);
  });

  test('fail if same md5 exists', async () => {
    const fakeImage = new MediaFile('test', 'png');
    await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
    await expect(service.isExist('test')).resolves.toBeTruthy();
    await expect(service.insert(fakeImage)).rejects.toThrow('duplicate');
  });
});
