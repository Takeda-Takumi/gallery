import { Test, TestingModule } from '@nestjs/testing';
import { MediaFileController } from './mediaFile.controller.mjs';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from '../../../../domain/mediafile/mediaFile.entity.mjs';
import { MediaFileService } from '../../../../domain/mediafile/mediaFile.service.mjs';
import { MediaFileFactory } from '../../../../domain/mediafile/mediaFile.factory.mjs';
import { MediaFileRepositoryMock } from '../../../../infrastructure/in-memory/mediaFile.repository.mock.mjs';

describe('MediaFileController', () => {
  let controller: MediaFileController;
  let app: INestApplication;
  let mediaFileRepositoryMock: Repository<MediaFile>;

  const testFileDir = 'test/files';
  const testFileName = 'image.png';
  const testFileNameSame = 'image_same.png';
  const testFileNameCompression = 'image_compression.png';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaFileController],
      providers: [
        MediaFileService,
        MediaFileFactory,
        {
          provide: getRepositoryToken(MediaFile),
          useClass: MediaFileRepositoryMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    controller = module.get<MediaFileController>(MediaFileController);
    mediaFileRepositoryMock = module.get<Repository<MediaFile>>(
      getRepositoryToken(MediaFile),
    );

    await app.init();
  });

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
    const id = 0;
    const data = { id: id };
    await mediaFileRepositoryMock.insert(data);

    const result = await request(app.getHttpServer()).get('/images/' + id);
    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual(data);
  });

  test('GET /images/id none', async () => {
    const data = { id: 0, extension: 'dummy' };
    await mediaFileRepositoryMock.insert(data);

    const result = await request(app.getHttpServer()).get('/images/' + 1);
    expect(result.status).toBe(200);
    expect(result.body).toBeNull;
  });

  test('delete media file', async () => {
    const id = 0;
    const data = { id: id, extension: 'png' };
    await mediaFileRepositoryMock.insert(data);

    const result = await request(app.getHttpServer()).delete(
      '/images/remove/' + id,
    );
    expect(result.status).toBe(200);
  });
});
