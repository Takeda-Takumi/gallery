import { Inject, Injectable } from "@nestjs/common";
import { FileStorage, fileStorageToken } from "../../domain/file.storage.interface.mjs";
import { GetImageInputDto, GetImageOutputDto } from "./get-image.usecase.dto.mjs";
import { UseCase } from "../usacase.interface.mjs";
import { MediaFileId } from "../../domain/mediafile/media-file-id.mjs";
import { Repository } from "typeorm";
import { MediaFile } from "../../domain/mediafile/mediaFile.entity.mjs";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class GetImageUseCase implements UseCase<GetImageInputDto, GetImageOutputDto> {
  constructor(
    @Inject(fileStorageToken)
    private readonly fileStorage: FileStorage,
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>
  ) { }

  async handle(input: GetImageInputDto) {
    const mediaFileId = new MediaFileId(input.id)
    const mediaFile = await this.mediaFileRepository.findOne({ where: { id: mediaFileId } })
    const file = await this.fileStorage.load(mediaFile)
    return new GetImageOutputDto(file, mediaFile)
  }
}
