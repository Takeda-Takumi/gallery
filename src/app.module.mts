import { Module } from '@nestjs/common';
import { AppController } from './app.controller.mjs';
import { AppService } from './app.service.mjs';
import { MediaFileModule } from './domain/mediafile/mediaFile.module.mjs';
import { TagControllerModule } from './presentation/http/controllers/tag/tag.controller.module.mjs';

@Module({
  imports: [
    MediaFileModule,
    TagControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

