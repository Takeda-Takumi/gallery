import { Test, TestingModule } from '@nestjs/testing';
import { MediaFileController } from './mediaFile.controller.mjs';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MediaFile } from '../../../../domain/mediafile/mediaFile.entity.mjs';
import { MediaFileService } from '../../../../domain/mediafile/mediaFile.service.mjs';
import { MediaFileFactory } from '../../../../domain/mediafile/mediaFile.factory.mjs';
import { FindOneUseCase } from '../../../../application/media-file/find-one.usecase.mjs';
import { UploadUseCase } from '../../../../application/media-file/upload.usecase.mjs';
import { RemoveUseCase } from '../../../../application/media-file/remove.usecase.mjs';
import { MediaFileTestFixture } from '../../../../domain/mediafile/mediaFile.text-fixture.mjs';
import { MediaFileRepositoryMock } from '../../../../infrastructure/in-memory/media-file/mediaFile.repository.mock.mjs';
import { FileStorage, fileStorageToken } from '../../../../domain/file.storage.interface.mjs';
import { InMemoryFileStorage } from '../../../../infrastructure/in-memory/file.storage.in-memory.mjs';
import { GetImageUseCase } from '../../../../application/media-file/get-image.usecase.mjs';
import { createTestConfigurationForSQLite } from '../../../../infrastructure/sql/configuration.database.integration.mjs';
import { Tag } from '../../../../domain/tag/tag.entity.mjs';

describe('MediaFileController', () => {
  let controller: MediaFileController;
  let app: INestApplication;
  let mediaFileRepository: Repository<MediaFile>;
  let fileStorage: FileStorage
  let dataSource: DataSource
  const mediaFileTestFixture: MediaFileTestFixture = new MediaFileTestFixture()

  const testFileDir = 'test/files';
  const testFileName = 'image.png';
  const testFileNameSame = 'image_same.png';
  const testFileNameCompression = 'image_compression.png';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(
          createTestConfigurationForSQLite([MediaFile, Tag])
        ),
        TypeOrmModule.forFeature([MediaFile])
      ],
      controllers: [MediaFileController],
      providers: [
        MediaFileService,
        MediaFileFactory,
        RemoveUseCase,
        FindOneUseCase,
        UploadUseCase,
        GetImageUseCase,

        // {
        //   provide: getRepositoryToken(MediaFile),
        //   useClass: MediaFileRepositoryMock,
        // },

        {
          provide: fileStorageToken,
          useClass: InMemoryFileStorage
        }
      ],
    }).compile();

    app = module.createNestApplication();
    controller = module.get<MediaFileController>(MediaFileController);
    mediaFileRepository = module.get<Repository<MediaFile>>(
      getRepositoryToken(MediaFile),
    );
    fileStorage = module.get<FileStorage>(fileStorageToken)
    dataSource = module.get<DataSource>(DataSource)

    await app.init();
  });

  afterEach(async () => {
    await mediaFileRepository.clear()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/images/upload 1', async () => {
    const result = await request(app.getHttpServer())
      .post('/images/upload')
      .attach('file', `${testFileDir}/${testFileName}`);
    expect(result.status).toBe(201);
  });

  it('/images/upload 2', async () => {
    const result = await request(app.getHttpServer())
      .post('/images/upload')
      .attach('file', `${testFileDir}/${testFileNameSame}`);
    expect(result.status).toBe(201);
  });

  it('/images/upload 3', async () => {
    const result = await request(app.getHttpServer())
      .post('/images/upload')
      .attach('file', `${testFileDir}/${testFileNameCompression}`);
    expect(result.status).toBe(201);
  });

  test('GET /images/id', async () => {
    const data = mediaFileTestFixture.mediaFileForTest()
    await mediaFileRepository.insert(data);

    const result = await request(app.getHttpServer()).get('/images/' + data.id.id);
    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual(
      {
        id: data.id.id,
        md5: data.md5
      }
    );
  });

  test('GET /images/id none', async () => {
    const data = mediaFileTestFixture.mediaFileForTest()
    await mediaFileRepository.insert(data);

    const result = await request(app.getHttpServer()).get('/images/' + 'nothing');
    expect(result.status).toBe(200);
    expect(result.body).toBeNull;
  });

  test('成功', async () => {
    const image = mediaFileTestFixture.imageFileForTest()
    const mediaFile = mediaFileTestFixture.mediaFileForTest({ md5: image.hash })

    await fileStorage.store(mediaFile, image.file)
    await mediaFileRepository.save(mediaFile)

    const response = await request(app.getHttpServer()).get(
      '/images/files/' + mediaFile.id.id,
    );

    expect(response.body).toStrictEqual(image.file)
    expect(response.status).toBe(200)
  })

  test('delete media file', async () => {
    const data = mediaFileTestFixture.mediaFileForTest()
    await mediaFileRepository.save(data);

    const result = await request(app.getHttpServer()).delete(
      '/images/' + data.id.id,
    );

    expect(result.status).toBe(200)
  }, 100000);
});
