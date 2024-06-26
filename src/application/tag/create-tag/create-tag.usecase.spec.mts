import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MediaFileModule } from '../../../domain/mediafile/mediaFile.module.mjs';
import { MediaFile } from '../../../domain/mediafile/mediaFile.entity.mjs';
import { Tag } from '../../../domain/tag/tag.entity.mjs';
import { TagService } from '../../../domain/tag/tag.service.mjs';
import { CreateTagUseCase } from './create-tag.usecase.mjs';
import { TagRepositoryToken } from '../../../domain/tag/tag.repository.interface.mjs';
import { TagTestFixture } from '../../../domain/tag/tag.test-fixture.mjs';
import { TypeOrmTagRepository } from '../../../infrastructure/sql/tag/tag.repository.typeorm.mjs';
import { createTestConfigurationForSQLite } from '../../../infrastructure/sql/configuration.database.integration.mjs';


describe('CreateTagUseCase', () => {
  let tagRepository: Repository<Tag>
  let mediaFileRepository: Repository<MediaFile>
  let dataSource: DataSource
  const tagTestFixture: TagTestFixture = new TagTestFixture()
  let usecase: CreateTagUseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MediaFileModule,
        TypeOrmModule.forRoot(
          createTestConfigurationForSQLite([MediaFile, Tag]),
        ),
        TypeOrmModule.forFeature([MediaFile, Tag]),
      ],
      providers: [
        TagService,
        {
          provide: TagRepositoryToken,
          useClass: TypeOrmTagRepository
        },
        CreateTagUseCase,
      ]
    }).compile();

    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    mediaFileRepository = module.get<Repository<MediaFile>>(
      getRepositoryToken(MediaFile),
    );
    usecase = module.get<CreateTagUseCase>(CreateTagUseCase)

    dataSource = module.get(DataSource);
  });

  afterEach(async () => {
    await dataSource.dropDatabase()
  });

  test.skip('fdsa', async () => {
    const tag = tagTestFixture.tagForTest()
    expect(await usecase.handle({ name: tag.name.name })).toBe({ id: tag.id.id, name: tag.name.name })
  })
})
