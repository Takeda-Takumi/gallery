import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service.mjs';
import { Tag } from './tag.entity.mjs';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { MediaFile } from '../mediaFile/mediaFile.entity.mjs';
import { DataSource, Repository } from 'typeorm';
import { createTestConfigurationForSQLite } from '../config/configuration.database.integration.mjs';

describe('TagService', () => {
  let service: TagService;
  let tagRepository: Repository<Tag>;
  let mediaFileRepository: Repository<MediaFile>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(
          createTestConfigurationForSQLite([MediaFile, Tag]),
        ),
        TypeOrmModule.forFeature([MediaFile, Tag]),
      ],
      providers: [TagService],
    }).compile();

    service = module.get<TagService>(TagService);
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    mediaFileRepository = module.get<Repository<MediaFile>>(
      getRepositoryToken(MediaFile),
    );

    dataSource = module.get(DataSource);
  });

  afterEach(async () => {
    await dataSource.createQueryBuilder().delete().from(MediaFile).execute();
    await dataSource.createQueryBuilder().delete().from(Tag).execute();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('同じ名前のタグは作成できない', async () => {
      const tag = { name: 'test' };
      await tagRepository.save(tag);
      expect(service.create(tag)).rejects.toThrow();
    });
  });

  describe('assignTag', () => {
    test('存在しないタグは指定できない', async () => {
      const tag = { id: 0, name: 'test' } as Tag;
      const mediaFile = { id: 0, md5: 'md5', extension: 'ext' } as MediaFile;
      expect(tagRepository.findOneBy({ id: tag.id })).resolves.toBeNull();
      await mediaFileRepository.save(mediaFile);

      await expect(service.assignTag(tag.id, mediaFile.id)).rejects.toThrow();
    });

    test('存在しない画像は指定できない', async () => {
      const tag = { id: 0, name: 'test' } as Tag;
      const mediaFile = { id: 0, md5: 'md5', extension: 'ext' } as MediaFile;

      await tagRepository.save(tag);

      await expect(
        mediaFileRepository.findOneBy({ id: mediaFile.id }),
      ).resolves.toBeNull();
      await expect(service.assignTag(tag.id, mediaFile.id)).rejects.toThrow();
    });

    test('初めて画像にタグを付ける', async () => {
      const tag = { id: 0, name: 'test' } as Tag;
      const mediaFile: MediaFile = {
        id: 0,
        md5: 'md5',
        extension: 'ext',
        tags: [],
      } as MediaFile;

      await tagRepository.save(tag);
      await mediaFileRepository.save(mediaFile);

      const result = await service.assignTag(tag.id, mediaFile.id);
      expect(result.mediaFiles.length).toBe(1);
      expect(result.mediaFiles.at(0).id).toBe(mediaFile.id);
    });

    test('画像にタグを付ける', async () => {
      const mediaFile0: MediaFile = {
        id: 0,
        md5: 'md50',
        extension: 'ext',
        tags: [],
      } as MediaFile;
      const mediaFile1: MediaFile = {
        id: 1,
        md5: 'md51',
        extension: 'ext',
        tags: [],
      } as MediaFile;

      const tag = { id: 0, name: 'test', mediaFiles: [mediaFile0] } as Tag;

      await mediaFileRepository.save([mediaFile0, mediaFile1]);
      await tagRepository.save(tag);

      const result = await service.assignTag(tag.id, mediaFile1.id);
      expect(result.mediaFiles.length).toBe(2);
      expect(result.mediaFiles.at(0).id).toBe(mediaFile0.id);
      expect(result.mediaFiles.at(1).id).toBe(mediaFile1.id);
    });
  });

  describe('updateTagName', () => {
    test('既存のタグの名前を変更する', async () => {
      expect(tagRepository.findOneBy({ name: 'new' })).resolves.toBeNull();

      await tagRepository.insert({ name: 'old' });
      expect(tagRepository.findOneBy({ name: 'old' })).resolves.not.toBeNull();

      await service.updateTagName('old', 'new');

      expect(tagRepository.findOneBy({ name: 'new' })).resolves.not.toBeNull();
      expect(tagRepository.findOneBy({ name: 'old' })).resolves.toBeNull();
    });

    test('存在しないタグの名前は変更できない', async () => {
      expect(tagRepository.findOneBy({ name: 'test' })).resolves.toBeNull();
      expect(service.updateTagName('test', 'new')).rejects.toThrow();
    });

    test('既存のタグの名前には変更できない', async () => {
      await service.create({ name: 'old' });
      await service.create({ name: 'new' });
      expect(service.updateTagName('old', 'new')).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    test('idで検索する', async () => {
      const mediaFile0: MediaFile = {
        id: 0,
        md5: 'md50',
        extension: 'ext',
        tags: [],
      } as MediaFile;
      const mediaFile1: MediaFile = {
        id: 1,
        md5: 'md51',
        extension: 'ext',
        tags: [],
      } as MediaFile;
      const tag = {
        id: 0,
        name: 'test',
        mediaFiles: [mediaFile0, mediaFile1],
      } as Tag;
      await mediaFileRepository.save([mediaFile0, mediaFile1]);
      await tagRepository.save(tag);
      const result: Tag = await service.findOne({ id: tag.id });
      expect(result.name).toBe('test');
    });
  });

  describe('delete', () => {
    test('存在しないタグは消せない', async () => {
      const tag = { id: 0, name: 'test', mediaFiles: [] } as Tag;
      expect(tagRepository.exist({ where: { id: tag.id } })).resolves.toBeFalsy;
      await expect(service.delete(tag.id)).rejects.toThrow();
    });

    test('タグに付いていた画像を消さない', async () => {
      const mediaFile0: MediaFile = {
        id: 0,
        md5: 'md50',
        extension: 'ext',
        tags: [],
      } as MediaFile;
      const mediaFile1: MediaFile = {
        id: 1,
        md5: 'md51',
        extension: 'ext',
        tags: [],
      } as MediaFile;
      const tag = { id: 0, name: 'test', mediaFiles: [mediaFile0] } as Tag;

      await mediaFileRepository.save([mediaFile0, mediaFile1]);
      await tagRepository.save(tag);

      await service.delete(tag.id);

      expect(await tagRepository.exist({ where: { id: tag.id } })).toBeFalsy();
      expect(
        await mediaFileRepository.exist({ where: { id: mediaFile0.id } }),
      ).toBeTruthy();
      expect(
        await mediaFileRepository.exist({ where: { id: mediaFile1.id } }),
      ).toBeTruthy();
    });
  });

  describe('remove', () => {
    test('存在しないタグは指定できない', async () => {
      const tag = { id: 0, name: 'test' } as Tag;
      const mediaFile = { id: 0, md5: 'md5', extension: 'ext' } as MediaFile;
      await mediaFileRepository.save(mediaFile);

      await expect(tagRepository.findOneBy({ id: tag.id })).resolves.toBeNull();
      await expect(service.remove(tag.id, mediaFile.id)).rejects.toThrow();
    });

    test('存在しない画像は指定できない', async () => {
      const tag = { id: 0, name: 'test' } as Tag;
      const mediaFile = { id: 0, md5: 'md5', extension: 'ext' } as MediaFile;
      await tagRepository.save(tag);

      await expect(
        mediaFileRepository.findOneBy({ id: mediaFile.id }),
      ).resolves.toBeNull();
      await expect(service.remove(tag.id, mediaFile.id)).rejects.toThrow();
    });

    test('指定したタグが付いていない画像は指定できない', async () => {
      const tag = { id: 0, name: 'test', mediaFiles: [] } as Tag;
      const mediaFile = { id: 0, md5: 'md5', extension: 'ext' } as MediaFile;
      await tagRepository.save(tag);
      await mediaFileRepository.save(mediaFile);

      await expect(service.remove(tag.id, mediaFile.id)).rejects.toThrow();
    });

    test('指定した画像から指定されたタグをはずす', async () => {
      const mediaFile0: MediaFile = {
        id: 0,
        md5: 'md50',
        extension: 'ext',
        tags: [],
      } as MediaFile;
      const mediaFile1: MediaFile = {
        id: 1,
        md5: 'md51',
        extension: 'ext',
        tags: [],
      } as MediaFile;
      const tag = {
        id: 0,
        name: 'test',
        mediaFiles: [mediaFile0, mediaFile1],
      } as Tag;

      await mediaFileRepository.save([mediaFile0, mediaFile1]);
      await tagRepository.save(tag);

      const oldTag = await tagRepository.findOne({
        relations: { mediaFiles: true },
        where: { id: tag.id },
      });
      expect(oldTag.mediaFiles.length).toBe(2);

      await service.remove(tag.id, mediaFile1.id);

      const newTag = await tagRepository.findOne({
        relations: { mediaFiles: true },
        where: { id: tag.id },
      });
      expect(newTag.mediaFiles.length).toBe(1);
      expect(newTag.mediaFiles.at(0).id).toBe(mediaFile0.id);
    });

    test('指定した画像に指定したタグがついている', async () => {
      const mediaFile0: MediaFile = {
        id: 0,
        md5: 'md50',
        extension: 'ext',
        tags: [],
      } as MediaFile;
      const tag = {
        id: 0,
        name: 'test',
        mediaFiles: [],
      } as Tag;

      await mediaFileRepository.save(mediaFile0);
      await tagRepository.save(tag);

      await expect(service.remove(tag.id, mediaFile0.id)).rejects.toThrow();
    });
  });
});
