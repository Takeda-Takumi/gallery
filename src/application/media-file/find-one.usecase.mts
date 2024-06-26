import { Injectable } from "@nestjs/common";
import { MediaFileService } from "../../domain/mediafile/mediaFile.service.mjs";
import { UseCase } from "../usacase.interface.mjs";
import { FindOneUseCaseInputDto, FindOneUseCaseOutputDto } from "./find-one.usecase.dto.mjs";
import { MediaFileId } from "../../domain/mediafile/media-file-id.mjs";

@Injectable()
export class FindOneUseCase implements UseCase<FindOneUseCaseInputDto, FindOneUseCaseOutputDto> {

  constructor(
    private readonly mediaFileService: MediaFileService
  ) { }

  async handle(input: FindOneUseCaseInputDto) {
    const id = new MediaFileId(input.id)
    const mediaFile = await this.mediaFileService.findOneById(id)
    if (mediaFile == null) return null
    return new FindOneUseCaseOutputDto(mediaFile)
  }
}
