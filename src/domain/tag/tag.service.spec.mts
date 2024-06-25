import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service.mjs';
import { Tag } from './tag.entity.mjs';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TagName } from './tagName.mjs';
import { MediaFile } from '../mediafile/mediaFile.entity.mjs';
import { createTestConfigurationForSQLite } from '../../infrastructure/sql/configuration.database.integration.mjs';
import { TagRepositoryToken } from './tag.repository.interface.mjs';
import { TypeOrmTagRepository } from '../../infrastructure/sql/tag.repository.typeorm.mjs';
import { TagTestFixture } from './tag.test-fixture.mjs';
import { AlreadyAssignedException, NotAssignedException, TagAlreadyExistsInRepositoryException, TagIsNotFoundInRepositoryException } from './tag.exception.mjs';
import { MediaFileIsNotFoundInRepositoryException } from '../mediafile/mediaFile.exception.mjs';
import { MediaFileTestFixture } from '../mediafile/mediaFile.text-fixture.mjs';

describe('TagService', () => {
  let service: TagService;
  let tagRepository: Repository<Tag>;
  let mediaFileRepository: Repository<MediaFile>;
  let dataSource: DataSource;
  const tagTestFixture: TagTestFixture = new TagTestFixture()
  const mediaFileTestFixture: MediaFileTestFixture = new MediaFileTestFixture()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(
          createTestConfigurationForSQLite([MediaFile, Tag]),
        ),
        TypeOrmModule.forFeature([MediaFile, Tag]),
      ],
      providers: [TagService, {
        provide: TagRepositoryToken,
        useClass: TypeOrmTagRepository
      }],
    }).compile();

    service = module.get<TagService>(TagService);
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    mediaFileRepository = module.get<Repository<MediaFile>>(
      getRepositoryToken(MediaFile),
    );

    dataSource = module.get(DataSource);
  });

  afterEach(async () => {
    await dataSource.dropDatabase()
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('同じ名前のタグは作成できない', async () => {
      const tag = tagTestFixture.tagForTest()
      await tagRepository.save(tag);
      expect(service.create(tag.name)).rejects.toBeInstanceOf(TagAlreadyExistsInRepositoryException);
    });
  });

  describe('assignTag', () => {
    test('存在しないタグは指定できない', async () => {
      const tag = tagTestFixture.tagForTest()
      const mediaFile = mediaFileTestFixture.mediaFileForTest()
      expect(tagRepository.findOneBy({ id: tag.id })).resolves.toBeNull();
      await mediaFileRepository.save(mediaFile);

      await expect(service.assignTag(tag.id, mediaFile.id)).rejects.toBeInstanceOf(TagIsNotFoundInRepositoryException);
    });

    test('存在しない画像は指定できない', async () => {
      const tag = tagTestFixture.tagForTest()
      const mediaFile = mediaFileTestFixture.mediaFileForTest()

      await tagRepository.save(tag);

      await expect(
        mediaFileRepository.findOneBy({ id: mediaFile.id }),
      ).resolves.toBeNull();
      await expect(service.assignTag(tag.id, mediaFile.id)).rejects.toBeInstanceOf(MediaFileIsNotFoundInRepositoryException);
    });

    test('初めて画像にタグを付ける', async () => {
      const tag = tagTestFixture.tagForTest()
      const mediaFile = mediaFileTestFixture.mediaFileForTest()

      await tagRepository.save(tag);
      await mediaFileRepository.save(mediaFile);

      const result = await service.assignTag(tag.id, mediaFile.id);
      expect(result.mediaFiles.length).toBe(1);
      expect(result.mediaFiles.at(0).id).toStrictEqual(mediaFile.id);
    }, 100000);

    test('画像にタグを付ける', async () => {
      const mediaFile1 = mediaFileTestFixture.mediaFileForTest1()
      const mediaFile2 = mediaFileTestFixture.mediaFileForTest2()
      const tag = tagTestFixture.tagForTest({ mediaFiles: [mediaFile1] })

      await mediaFileRepository.save([mediaFile1, mediaFile2]);
      await tagRepository.save(tag);

      const result = await service.assignTag(tag.id, mediaFile2.id);
      expect(result.mediaFiles.length).toBe(2);
      expect(result.mediaFiles.at(0).id).toStrictEqual(mediaFile1.id);
      expect(result.mediaFiles.at(1).id).toStrictEqual(mediaFile2.id);
    });

    test('1つの画像に重複してタグを付けられない', async () => {
      const mediaFile1 = mediaFileTestFixture.mediaFileForTest()
      const tag = tagTestFixture.tagForTest({ mediaFiles: [mediaFile1] })

      await mediaFileRepository.save([mediaFile1]);
      await tagRepository.save(tag);

      await expect(service.assignTag(tag.id, mediaFile1.id)).rejects.toBeInstanceOf(AlreadyAssignedException);
    });
  });

  describe('updateTagName', () => {
    test('既存のタグの名前を変更する', async () => {
      const oldTag = tagTestFixture.tagForTest({ name: 'old' })
      const newTagName = new TagName('new')
      expect(tagRepository.findOne({ where: { name: newTagName } })).resolves.toBeNull();

      await tagRepository.insert(oldTag);

      await service.changeName(oldTag.id, newTagName);

      const result = await tagRepository.findOne({ where: { id: oldTag.id } })

      expect(result.name).toStrictEqual(newTagName)

      expect(tagRepository.findOneBy({ name: oldTag.name })).resolves.toBeNull();
    });

    test('存在しないタグの名前は変更できない', async () => {
      const tag = tagTestFixture.tagForTest()
      expect(tagRepository.findOneBy({ id: tag.id })).resolves.toBeNull();
      expect(service.changeName(tag.id, new TagName('new'))).rejects.toBeInstanceOf(TagIsNotFoundInRepositoryException);
    });

    test('既存のタグの名前には変更できない', async () => {
      const oldTag = tagTestFixture.tagForTest1({ name: 'old' })
      const newTag = tagTestFixture.tagForTest2({ name: 'new' })
      await tagRepository.save([oldTag, newTag])
      expect(service.changeName(oldTag.id, newTag.name)).rejects.toBeInstanceOf(TagAlreadyExistsInRepositoryException);
    });
  });

  describe('findOne', () => {
    test('idで検索する', async () => {
      const mediaFile1 = mediaFileTestFixture.mediaFileForTest1()
      const mediaFile2 = mediaFileTestFixture.mediaFileForTest2()
      const tag = tagTestFixture.tagForTest({ mediaFiles: [mediaFile1, mediaFile2] })

      await mediaFileRepository.save([mediaFile1, mediaFile2]);
      await tagRepository.save(tag);

      const result: Tag = await service.findOne(tag.id);
      expect(result.name).toStrictEqual(tag.name);
    });
  });

  describe('delete', () => {
    test('存在しないタグは消せない', async () => {
      const tag = tagTestFixture.tagForTest()

      expect(tagRepository.exist({ where: { id: tag.id } })).resolves.toBeFalsy;
      await expect(service.delete(tag.id)).rejects.toBeInstanceOf(TagIsNotFoundInRepositoryException);
    });

    test('タグに付いていた画像を消さない', async () => {
      const mediaFile1 = mediaFileTestFixture.mediaFileForTest1()
      const mediaFile2 = mediaFileTestFixture.mediaFileForTest2()
      const tag = tagTestFixture.tagForTest({ mediaFiles: [mediaFile1] })

      await mediaFileRepository.save([mediaFile1, mediaFile2]);
      await tagRepository.save(tag);

      await service.delete(tag.id);

      expect(await tagRepository.exist({ where: { id: tag.id } })).toBeFalsy();
      expect(
        await mediaFileRepository.exist({ where: { id: mediaFile1.id } }),
      ).toBeTruthy();
      expect(
        await mediaFileRepository.exist({ where: { id: mediaFile2.id } }),
      ).toBeTruthy();
    });
  });

  describe('remove', () => {
    test('存在しないタグは指定できない', async () => {
      const mediaFile = mediaFileTestFixture.mediaFileForTest()
      const tag = tagTestFixture.tagForTest()

      await mediaFileRepository.save(mediaFile);

      await expect(tagRepository.findOneBy({ id: tag.id })).resolves.toBeNull();
      await expect(service.remove(tag.id, mediaFile.id)).rejects.toBeInstanceOf(TagIsNotFoundInRepositoryException);
    });

    test('存在しない画像は指定できない', async () => {
      const mediaFile = mediaFileTestFixture.mediaFileForTest()
      const tag = tagTestFixture.tagForTest()

      await tagRepository.save(tag);

      await expect(
        mediaFileRepository.findOneBy({ id: mediaFile.id }),
      ).resolves.toBeNull();
      await expect(service.remove(tag.id, mediaFile.id)).rejects.toBeInstanceOf(MediaFileIsNotFoundInRepositoryException);
    });

    test('指定したタグが付いていない画像は指定できない', async () => {
      const mediaFile = mediaFileTestFixture.mediaFileForTest()
      const tag = tagTestFixture.tagForTest()
      await tagRepository.save(tag);
      await mediaFileRepository.save(mediaFile);

      await expect(service.remove(tag.id, mediaFile.id)).rejects.toBeInstanceOf(NotAssignedException);
    });

    test('指定した画像から指定されたタグをはずす', async () => {
      const mediaFile1 = mediaFileTestFixture.mediaFileForTest1()
      const mediaFile2 = mediaFileTestFixture.mediaFileForTest2()
      const tag = tagTestFixture.tagForTest({ mediaFiles: [mediaFile1, mediaFile2] })

      await mediaFileRepository.save([mediaFile1, mediaFile2]);
      await tagRepository.save(tag);

      const oldTag = await tagRepository.findOne({
        relations: { mediaFiles: true },
        where: { id: tag.id },
      });
      expect(oldTag.mediaFiles.length).toBe(2);

      await service.remove(tag.id, mediaFile2.id);

      const newTag = await tagRepository.findOne({
        relations: { mediaFiles: true },
        where: { id: tag.id },
      });
      expect(newTag.mediaFiles.length).toBe(1);
      expect(newTag.mediaFiles.at(0).id).toStrictEqual(mediaFile1.id);
    });
  });
});
