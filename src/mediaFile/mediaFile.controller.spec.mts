import { Test, TestingModule } from '@nestjs/testing';
import { MediaFileController } from './mediaFile.controller.mjs';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MediaFile } from '../mediaFile/mediaFile.entity.mjs';
import { MediaFileRepositoryMock } from '../mediaFile/mediaFile.repository.mock.mjs';
import { MediaFileService } from '../mediaFile/mediaFile.service.mjs';
import { MediaFileFactory } from '../mediaFile/mediaFile.factory.mjs';

describe('MediaFileController', () => {
  let controller: MediaFileController;
  let app: INestApplication;

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
});
