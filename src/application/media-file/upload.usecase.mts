import { Inject, Injectable } from "@nestjs/common";
import { MediaFileService } from "../../domain/mediafile/mediaFile.service.mjs";
import { UseCase } from "../usacase.interface.mjs";
import { UploadUseCaseInputDto, UploadUseCaseOutPutDto } from "./upload.usecase.dto.mjs";
import { MediaFileFactory } from "../../domain/mediafile/mediaFile.factory.mjs";
import { FileStorage, fileStorageToken } from "../../domain/file.storage.interface.mjs";

@Injectable()
export class UploadUseCase implements UseCase<UploadUseCaseInputDto, UploadUseCaseOutPutDto> {

  constructor(
    private readonly mediaFileService: MediaFileService,
    private readonly mediaFileFactory: MediaFileFactory,

    @Inject(fileStorageToken)
    private readonly fileStorage: FileStorage
  ) { }

  async handle(input: UploadUseCaseInputDto) {
    const file = input.file
    const mediaFile = await this.mediaFileFactory.parse(file);

    const InsertedMediaFile = await this.mediaFileService.insert(mediaFile.md5, mediaFile.extension)
    await this.fileStorage.store(InsertedMediaFile, file)

    return new UploadUseCaseOutPutDto(InsertedMediaFile)
  }
}

