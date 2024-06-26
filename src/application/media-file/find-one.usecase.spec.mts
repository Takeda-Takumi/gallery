import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from '../../domain/mediafile/mediaFile.entity.mjs';
import { MediaFileRepositoryMock } from '../../infrastructure/in-memory/media-file/mediaFile.repository.mock.mjs';
import { FileStorage, fileStorageToken } from '../../domain/file.storage.interface.mjs';
import { InMemoryFileStorage } from '../../infrastructure/in-memory/file.storage.in-memory.mjs';
import { MediaFileService } from '../../domain/mediafile/mediaFile.service.mjs';
import { MediaFileFactory } from '../../domain/mediafile/mediaFile.factory.mjs';
import { FindOneUseCase } from './find-one.usecase.mjs';
import { MediaFileTestFixture } from '../../domain/mediafile/mediaFile.text-fixture.mjs';

describe('FindOneUseCase', () => {
  let mediaFileRepository: Repository<MediaFile>
  let usecase: FindOneUseCase
  let fileStorage: FileStorage
  const mediaFileTestFixture: MediaFileTestFixture = new MediaFileTestFixture()


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaFileService,
        MediaFileFactory,
        {
          provide: getRepositoryToken(MediaFile),
          useClass: MediaFileRepositoryMock
        },
        {
          provide: fileStorageToken,
          useClass: InMemoryFileStorage
        },
        FindOneUseCase
      ]
    }).compile();

    mediaFileRepository = module.get<Repository<MediaFile>>(
      getRepositoryToken(MediaFile),
    );
    usecase = module.get<FindOneUseCase>(FindOneUseCase)
    fileStorage = module.get<FileStorage>(fileStorageToken)

  });

  afterEach(async () => {
    fileStorage.clear()
  });

  test('正常', async () => {
    const mediaFile = mediaFileTestFixture.mediaFileForTest()
    await mediaFileRepository.save(mediaFile)

    const result = await usecase.handle({ id: mediaFile.id.id })
    expect(result.id).toBe(mediaFile.id.id)
    expect(result.md5).toBe(mediaFile.md5)
  })
})
