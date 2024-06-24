import { Injectable } from "@nestjs/common";
import { MediaFileService } from "../../domain/mediafile/mediaFile.service.mjs";
import { UseCase } from "../usacase.interface.mjs";
import { FindOneUseCaseInputDto, FindOneUseCaseOutputDto } from "./find-one.usecase.dto.mjs";

@Injectable()
export class FindOneUseCase implements UseCase<FindOneUseCaseInputDto, FindOneUseCaseOutputDto> {

  constructor(
    private readonly mediaFileService: MediaFileService
  ) { }

  async handle(input: FindOneUseCaseInputDto) {
    const md5 = input.md5
    const id = Number(input.id)
    const mediaFile = await this.mediaFileService.findOne({ id: id, md5: md5 })
    if (mediaFile == null) return null
    return new FindOneUseCaseOutputDto(mediaFile)
  }
}
