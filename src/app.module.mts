import { Module } from '@nestjs/common';
import { AppController } from './app.controller.mjs';
import { AppService } from './app.service.mjs';
import { TagControllerModule } from './presentation/http/controllers/tag/tag.controller.module.mjs';
import { MediaFileControllerModule } from './presentation/http/controllers/mediafile/mediaFile.controller.module.mjs';

@Module({
  imports: [
    MediaFileControllerModule,
    TagControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

