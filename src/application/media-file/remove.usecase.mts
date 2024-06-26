import { Inject, Injectable } from "@nestjs/common";
import { MediaFileService } from "../../domain/mediafile/mediaFile.service.mjs";
import { UseCase } from "../usacase.interface.mjs";
import { MediaFileId } from "../../domain/mediafile/media-file-id.mjs";
import { RemoveUseCaseInputDto } from "./remove.usecase.dto.mjs";
import { FileStorage, fileStorageToken } from "../../domain/file.storage.interface.mjs";

@Injectable()
export class RemoveUseCase implements UseCase<RemoveUseCaseInputDto, void> {

  constructor(
    private readonly mediaFileService: MediaFileService,
    @Inject(fileStorageToken)
    private readonly fileStorage: FileStorage,
  ) { }

  async handle(input: RemoveUseCaseInputDto) {
    const id = new MediaFileId(input.id)
    const mediaFile = await this.mediaFileService.findOneById(id)
    await this.fileStorage.remove(mediaFile)
    await this.mediaFileService.remove(mediaFile.id)
  }
}

