import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from './mediaFile.entity.mjs';
import { MediaFileService } from './mediaFile.service.mjs';
import { MediaFileRepositoryMock } from '../../infrastructure/in-memory/mediaFile.repository.mock.mjs';
import { MediaFileTestFixture } from './mediaFile.text-fixture.mjs';
import { MediaFileId } from './media-file-id.mjs';

describe('MediafileService', () => {
  let service: MediaFileService;
  let mediaFileRepository: Repository<MediaFile>;
  const mediaFileTestFixture: MediaFileTestFixture = new MediaFileTestFixture()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaFileService,
        {
          provide: getRepositoryToken(MediaFile),
          useClass: MediaFileRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<MediaFileService>(MediaFileService);
    mediaFileRepository = module.get<Repository<MediaFile>>(
      getRepositoryToken(MediaFile),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('md5', () => {
      test("findOne md5 'test'", async () => {
        await mediaFileRepository.insert({ md5: 'test', extension: 'png' });
        const result = await service.findOne({ md5: 'test' });
        expect(result).not.toBeNull();
      });

      test('findOne md5 empty', async () => {
        const data = mediaFileTestFixture.mediaFileForTest()
        await mediaFileRepository.insert(data)
        const result = await service.findOne({ md5: '' });
        expect(result).toBeNull();
      });

      test('parameter md5 which is undefined return first element', async () => {

        const data1 = mediaFileTestFixture.mediaFileForTest1()
        const data2 = mediaFileTestFixture.mediaFileForTest2()

        await mediaFileRepository.insert(data1);
        await mediaFileRepository.insert(data2);
        expect(service.findOne({ md5: undefined })).resolves.toStrictEqual(
          data1,
        );
      });

      test('findOne md5 none', async () => {
        const result = await service.findOne({ md5: 'test' });
        expect(result).toBeNull();
      });
    });

    describe('id', () => {
      test('find one by id', async () => {

        const data1 = mediaFileTestFixture.mediaFileForTest1()
        const data2 = mediaFileTestFixture.mediaFileForTest2()

        await mediaFileRepository.insert(data1);
        await mediaFileRepository.insert(data2);
        expect(service.findOne({ id: data2.id })).resolves.toStrictEqual(data2);
      });

      test("id which dosen't exist returns null", async () => {

        const data1 = mediaFileTestFixture.mediaFileForTest1()
        const data2 = mediaFileTestFixture.mediaFileForTest2()

        await mediaFileRepository.insert(data1);
        await mediaFileRepository.insert(data2);
        expect(service.findOne({ id: new MediaFileId("nothing") })).resolves.toBeNull();
      });
    });

    test("md5 and id exist but data dosen't exist ", async () => {

      const data1 = mediaFileTestFixture.mediaFileForTest1()
      const data2 = mediaFileTestFixture.mediaFileForTest2()

      await mediaFileRepository.insert(data1);
      await mediaFileRepository.insert(data2);
      expect(service.findOne({ md5: 'test1', id: new MediaFileId("nothing") })).resolves.toBeNull();
    });
  });

  describe('exist', () => {
    test('exist md5 "test"', async () => {
      const data = mediaFileTestFixture.mediaFileForTest()
      await mediaFileRepository.insert(data)
      await expect(service.exists({ md5: data.md5 })).resolves.toBeTruthy();
    });

    test('not exist md5 "notExist"', async () => {
      const data = mediaFileTestFixture.mediaFileForTest()
      await mediaFileRepository.insert(data)
      await expect(service.exists({ md5: 'nothing' })).resolves.toBeFalsy();
    });
  });
  //
  describe('insert', () => {
    test('success insert', async () => {
      const data = mediaFileTestFixture.mediaFileForTest()
      await expect(service.exists({ md5: data.md5 })).resolves.toBeFalsy();
      await service.insert(data.md5, data.extension);
    });

    test('fail if same md5 exists', async () => {
      await mediaFileRepository.insert({ md5: 'test', extension: 'png' });

      const data = mediaFileTestFixture.mediaFileForTest()
      await mediaFileRepository.insert(data)

      await expect(service.exists({ md5: data.md5 })).resolves.toBeTruthy();
      await expect(service.insert(data.md5, data.extension)).rejects.toThrow('duplicate');
    });
  });

  describe('remove', () => {
    test('remove media file by id', async () => {
      const data1 = mediaFileTestFixture.mediaFileForTest1()
      const data2 = mediaFileTestFixture.mediaFileForTest2()

      await mediaFileRepository.insert(data1);
      await mediaFileRepository.insert(data2);

      await service.remove(data1.id);
      expect(
        mediaFileRepository.findOne({ where: { md5: data1.md5 } }),
      ).resolves.toBeNull();
      expect(
        mediaFileRepository.findOne({ where: { md5: data2.md5 } }),
      ).resolves.toStrictEqual(data2);
    });

    test('removing media file which dose not exist is invalid', async () => {
      const data1 = mediaFileTestFixture.mediaFileForTest1()

      expect(service.remove(data1.id)).rejects.toThrow();
    });
  });
});
