import { Module } from '@nestjs/common';
import { AppController } from './app.controller.mjs';
import { AppService } from './app.service.mjs';
import { UploadModule } from './upload/upload.module.mjs';
import { ImageUploadModule } from './image/uplaod/image.upload.module.mjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaFile } from './mediaFile/mediaFile.entity.mjs';
import { MediaFileModule } from './mediaFile/mediaFile.module.mjs';

@Module({
  imports: [
    UploadModule,
    MediaFileModule,
    ImageUploadModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/testdb.splite3',
      entities: [MediaFile],
      synchronize: true,
      logging: true,
      logger: 'file',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
