import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller.mjs';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MediaFile } from '../mediaFile/mediaFile.entity.mjs';
import { MediaFileService } from '../mediaFile/mediaFile.service.mjs';
import { MediaFileRepositoryMock } from '../mediaFile/mediaFile.repository.mock.mjs';
import { ImageUploadService } from '../image/uplaod/image.upload.service.mjs';

describe('UploadController', () => {
  let controller: UploadController;
  let app: INestApplication;

  const testFileDir = 'test/files';
  const testFileName = 'image.png';
  const testFileNameSame = 'image_same.png';
  const testFileNameCompression = 'image_compression.png';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        MediaFileService,
        ImageUploadService,
        {
          provide: getRepositoryToken(MediaFile),
          useClass: MediaFileRepositoryMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    controller = module.get<UploadController>(UploadController);

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/upload ', async () => {
    const result = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', `${testFileDir}/${testFileName}`);
    expect(result.status).toBe(201);
  });

  it('/upload ', async () => {
    const result = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', `${testFileDir}/${testFileNameSame}`);
    expect(result.status).toBe(201);
  });

  it('/upload ', async () => {
    const result = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', `${testFileDir}/${testFileNameCompression}`);
    expect(result.status).toBe(201);
  });
});
