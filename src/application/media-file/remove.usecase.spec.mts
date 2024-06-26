import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from '../../domain/mediafile/mediaFile.entity.mjs';
import { FileStorage, fileStorageToken } from '../../domain/file.storage.interface.mjs';
import { InMemoryFileStorage } from '../../infrastructure/in-memory/file.storage.in-memory.mjs';
import { MediaFileService } from '../../domain/mediafile/mediaFile.service.mjs';
import { MediaFileFactory } from '../../domain/mediafile/mediaFile.factory.mjs';
import { MediaFileTestFixture } from '../../domain/mediafile/mediaFile.text-fixture.mjs';
import { RemoveUseCase } from './remove.usecase.mjs';
import { createTestConfigurationForSQLite } from '../../infrastructure/sql/configuration.database.integration.mjs';
import { Tag } from '../../domain/tag/tag.entity.mjs';

describe('RemoveUseCase', () => {
  let mediaFileRepository: Repository<MediaFile>
  let usecase: RemoveUseCase
  let fileStorage: FileStorage
  const mediaFiletestfixture: MediaFileTestFixture = new MediaFileTestFixture()


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(
          createTestConfigurationForSQLite([MediaFile, Tag])
        ),
        TypeOrmModule.forFeature([MediaFile, Tag])
      ],
      providers: [
        MediaFileService,
        MediaFileFactory,
        {
          provide: fileStorageToken,
          useClass: InMemoryFileStorage
        },
        RemoveUseCase
      ]
    }).compile();

    mediaFileRepository = module.get<Repository<MediaFile>>(
      getRepositoryToken(MediaFile),
    );
    usecase = module.get<RemoveUseCase>(RemoveUseCase)
    fileStorage = module.get<FileStorage>(fileStorageToken)

  });

  afterEach(async () => {
    fileStorage.clear()
  });

  test('正常', async () => {
    const image = mediaFiletestfixture.imageFileForTest()
    const mediaFile = mediaFiletestfixture.mediaFileForTest({ md5: image.hash })
    await fileStorage.store(mediaFile, image.file)
    await mediaFileRepository.save(mediaFile)

    expect(await fileStorage.exist(mediaFile)).toBeTruthy()
    expect(await mediaFileRepository.exist({ where: { id: mediaFile.id } })).toBeTruthy()

    await usecase.handle({ id: mediaFile.id.id })

    expect(await fileStorage.exist(mediaFile)).toBeFalsy()
    expect(await mediaFileRepository.exist({ where: { id: mediaFile.id } })).toBeFalsy()
  })
})



