import { Injectable } from "@nestjs/common";
import { MediaFileService } from "../../domain/mediafile/mediaFile.service.mjs";
import { UseCase } from "../usacase.interface.mjs";
import { UploadUseCaseInputDto, UploadUseCaseOutPutDto } from "./upload.usecase.dto.mjs";
import { MediaFileFactory } from "../../domain/mediafile/mediaFile.factory.mjs";

@Injectable()
export class UploadUseCase implements UseCase<UploadUseCaseInputDto, UploadUseCaseOutPutDto> {

  constructor(
    private readonly mediaFileService: MediaFileService,
    private readonly mediaFileFactory: MediaFileFactory
  ) { }

  async handle(input: UploadUseCaseInputDto) {
    const file = input.file
    const mediaFile = await this.mediaFileFactory.parse(file);

    await this.mediaFileService.insert(mediaFile)

    return new UploadUseCaseOutPutDto(mediaFile)
  }
}

