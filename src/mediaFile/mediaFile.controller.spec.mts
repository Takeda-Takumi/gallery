import { Test, TestingModule } from '@nestjs/testing';
import { MediaFileController } from './mediaFile.controller.mjs';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MediaFile } from '../mediaFile/mediaFile.entity.mjs';
import { MediaFileRepositoryMock } from '../mediaFile/mediaFile.repository.mock.mjs';
import { MediaFileService } from '../mediaFile/mediaFile.service.mjs';
import { MediaFileFactory } from '../mediaFile/mediaFile.factory.mjs';
import { Repository } from 'typeorm';

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

  it('/image/upload 1', async () => {
    const result = await request(app.getHttpServer())
      .post('/image/upload')
      .attach('file', `${testFileDir}/${testFileName}`);
    expect(result.status).toBe(201);
  });

  it('/image/upload 2', async () => {
    const result = await request(app.getHttpServer())
      .post('/image/upload')
      .attach('file', `${testFileDir}/${testFileNameSame}`);
    expect(result.status).toBe(201);
  });

  it('/image/upload 3', async () => {
    const result = await request(app.getHttpServer())
      .post('/image/upload')
      .attach('file', `${testFileDir}/${testFileNameCompression}`);
    expect(result.status).toBe(201);
  });

  test('GET /image/md5', async () => {
    const md5 = 'md5';
    const data = { md5: md5, extension: 'png' };
    await mediaFileRepositoryMock.insert(data);

    const result = await request(app.getHttpServer()).get('/image/' + md5);
    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual(data);
  });

  test('GET /image/md5', async () => {
    const data = { md5: 'dummy', extension: 'dummy' };
    await mediaFileRepositoryMock.insert(data);

    const result = await request(app.getHttpServer()).get('/image/' + 'none');
    expect(result.status).toBe(200);
    expect(result.body).toBeNull;
  });
});
