import { Module } from "@nestjs/common";
import { MediaFileUseCaseModule } from "../../../../application/media-file/mediafile.usecase.module.mjs";
import { MediaFileController } from "./mediaFile.controller.mjs";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    MediaFileUseCaseModule,
    MulterModule.register({
      limits: {
        fileSize: 30 * 1024 * 1024,
      },
    }),
  ],
  controllers: [MediaFileController]
})
export class MediaFileControllerModule { }
