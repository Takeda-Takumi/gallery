import { Module } from "@nestjs/common";
import { FindOneUseCase } from "./find-one.usecase.mjs";
import { UploadUseCase } from "./upload.usecase.mjs";
import { RemoveUseCase } from "./remove.usecase.mjs";
import { MediaFileModule } from "../../domain/mediafile/mediaFile.module.mjs";
import { InMemoryFileStorage } from "../../infrastructure/in-memory/file.storage.in-memory.mjs";
import { fileStorageToken } from "../../domain/file.storage.interface.mjs";
import { GetImageUseCase } from "./get-image.usecase.mjs";
import { LinuxFileStorage } from "../../infrastructure/local-storage/file.storage.linux.mjs";

@Module({
  imports: [
    MediaFileModule
  ],
  providers: [
    FindOneUseCase,
    UploadUseCase,
    RemoveUseCase,
    GetImageUseCase,
    {
      provide: fileStorageToken,
      useClass: LinuxFileStorage
    }
  ],
  exports: [
    FindOneUseCase,
    UploadUseCase,
    RemoveUseCase,
    GetImageUseCase,
  ]
})
export class MediaFileUseCaseModule { }
