import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller.mjs';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from '../../../../domain/tag/tag.entity.mjs';
import { DataSource, Repository } from 'typeorm';
import { MediaFile } from '../../../../domain/mediafile/mediaFile.entity.mjs';
import { MediaFileModule } from '../../../../domain/mediafile/mediaFile.module.mjs';
import { createTestConfigurationForSQLite } from '../../../../infrastructure/sql/configuration.database.integration.mjs';
import { TypeOrmTagRepository } from '../../../../infrastructure/sql/tag.repository.typeorm.mjs';
import { TagService } from '../../../../domain/tag/tag.service.mjs';
import { DeleteUseCase } from '../../../../application/tag/delete/delete.usecase.mjs';
import { RemoveUseCase } from '../../../../application/tag/remove/remove.usecase.mjs';
import { AssignUseCase } from '../../../../application/tag/assign/assign.usecase.mjs';
import { CreateTagUseCase } from '../../../../application/tag/create-tag/create-tag.usecase.mjs';
import { FindTagUseCase } from '../../../../application/tag/find-tag/find-tag.usecase.mjs';
import { ChangeTagNameUsecase } from '../../../../application/tag/change-tag-name/change-tag-name.usecase.mjs';
import { TagRepositoryToken } from '../../../../domain/tag/tag.repository.interface.mjs';
import { TagTestFixture } from '../../../../domain/tag/tag.test-fixture.mjs';


describe('TagController', () => {
  let controller: TagController;
  let app: INestApplication;
  let tagRepository: Repository<Tag>
  let mediaFileRepository: Repository<MediaFile>
  let dataSource: DataSource
  const tagTestFixture: TagTestFixture = new TagTestFixture()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      imports: [MediaFileModule,
        TypeOrmModule.forRoot(
          createTestConfigurationForSQLite([MediaFile, Tag]),
        ),
        TypeOrmModule.forFeature([MediaFile, Tag]),
      ],
      providers: [
        {
          provide: TagRepositoryToken,
          useClass: TypeOrmTagRepository
        },
        DeleteUseCase,
        RemoveUseCase,
        AssignUseCase,
        ChangeTagNameUsecase,
        CreateTagUseCase,
        FindTagUseCase,
        TagService,
      ]
    }).compile();

    app = module.createNestApplication();
    controller = module.get<TagController>(TagController);
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    mediaFileRepository = module.get<Repository<MediaFile>>(
      getRepositoryToken(MediaFile),
    );

    dataSource = module.get(DataSource);


    app.useGlobalPipes(new ValidationPipe({
      transform: true
    }));

    await app.init()

  });

  afterEach(async () => {
    await dataSource.dropDatabase()
  });

  describe('GET /tags/{id}', () => {
    test('存在しないidが指定された場合、空のオブジェクトを返す', async () => {
      const tag = tagTestFixture.tagForTest()

      expect(await tagRepository.exist({ where: { id: tag.id } })).toBeFalsy()
      const response = await request(app.getHttpServer()).get('/tags/' + tag.id.id)
      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({})
    })

    test('成功', async () => {
      const mediaFile = tagTestFixture.mediaFileForTest()
      const tag = tagTestFixture.tagForTest({ mediaFiles: [mediaFile] })
      await tagRepository.save(tag)
      const response = await request(app.getHttpServer()).get('/tags/' + tag.id.id)
      expect(response.status).toBe(200)
      expect(response.body.id).toEqual(tag.id.id)
      expect(response.body).toEqual(
        {
          id: tag.id.id,
          name: tag.name.name,
          mediaFiles: [
            {
              id: mediaFile.id,
              extension: mediaFile.extension,
              md5: mediaFile.md5
            }
          ],
        }
      )
    })
  })

  describe('PUT /tags/{id}', () => {
    describe('changeTagName', () => {
      test('成功', async () => {
        const oldTag = tagTestFixture.tagForTest({ name: 'oldTag' })
        const newTagName = tagTestFixture.tagForTest({ name: 'newTag' })
        await tagRepository.save(oldTag)

        const response = await request(app.getHttpServer()).put('/tags/' + oldTag.id.id).send({ name: newTagName.name })
        expect(response.status).toBe(200)
        expect(response.body).toEqual(
          {
            id: oldTag.id.id,
            name: newTagName.name
          }
        )
      })

      test('同じ名前', async () => {
        const oldTag = tagTestFixture.tagForTest({ name: 'oldTag' })
        await tagRepository.save(oldTag)
        const response = await request(app.getHttpServer()).put('/tags/' + oldTag.id.id).send({ name: oldTag.name.name })
        expect(response.status).toBe(500)
      })
    })
  })

  describe('PUT /tags/{id}/mediafiles/{id}', () => {
    describe('assign', () => {
      test('成功', async () => {
        const mediaFile = tagTestFixture.mediaFileForTest()
        const tag = tagTestFixture.tagForTest()
        await mediaFileRepository.save(mediaFile)
        await tagRepository.save(tag)

        const response = await request(app.getHttpServer()).put('/tags/' + tag.id.id + '/mediafiles/' + mediaFile.id)
        expect(response.status).toBe(200)

        const updatedtag = await tagRepository.findOne({ relations: { mediaFiles: true }, where: { id: tag.id } })
        expect(updatedtag.mediaFiles.find((val) => val.id === mediaFile.id)).toBeTruthy()
      }, 1000000)
    })
  })

  describe('DELETE /tags/{id}/mediafiles/{id}', () => {
    describe('remove', () => {
      test('成功', async () => {
        const mediaFile = tagTestFixture.mediaFileForTest()
        const tag = tagTestFixture.tagForTest({ mediaFiles: [mediaFile] })
        await mediaFileRepository.save(mediaFile)
        await tagRepository.save(tag)

        await expect(mediaFileRepository.exist({ where: { id: mediaFile.id } })).resolves.toBeTruthy()
        const response = await request(app.getHttpServer()).delete('/tags/' + tag.id.id + '/mediafiles/' + mediaFile.id)
        expect(response.status).toBe(200)

        const updatedtag = await tagRepository.findOne({ relations: { mediaFiles: true }, where: { id: tag.id } })
        expect(updatedtag.mediaFiles.find((val) => val.id === mediaFile.id)).toBeFalsy()
      })
    })
  })


  describe('DELETE /tags/{id}', () => {
    describe('delete', () => {
      test('成功', async () => {
        const mediaFile = tagTestFixture.mediaFileForTest()
        const tag = tagTestFixture.tagForTest({ mediaFiles: [mediaFile] })
        await mediaFileRepository.save(mediaFile)
        await tagRepository.save(tag)
        await expect(mediaFileRepository.exist({ where: { id: mediaFile.id } })).resolves.toBeTruthy()

        const response = await request(app.getHttpServer()).delete('/tags/' + tag.id.id)
        expect(response.status).toBe(200)

        await expect(tagRepository.exist({ where: { id: tag.id } })).resolves.toBeFalsy()
        await expect(mediaFileRepository.exist({ where: { id: mediaFile.id } })).resolves.toBeTruthy()
      })
    })
  })

  describe('POST /tags', () => {
    describe('create', () => {
      test('成功', async () => {
        const tag = { name: 'name' }
        const response = await request(app.getHttpServer()).post('/tags/').send({ name: tag.name })
        expect(response.body.name).toBe(tag.name)
        expect(response.body.id).not.toBeUndefined()
      })

      test('空文字列はエラー', async () => {
        const tag = { name: '' }
        const response = await request(app.getHttpServer()).post('/tags/').send(tag)
        expect(response.status).toBe(400)
      })
    })
  })
});
