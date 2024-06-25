import { MediaFileId } from "./media-file-id.mjs";
import { MediaFile } from "./mediaFile.entity.mjs";

export class MediaFileTestFixture {
  mediaFileForTest({
    id,
    md5,
    extension
  }: {
    id?: string
    md5?: string
    extension?: string
  } = {}) {
    return this.mediaFileForTest1({
      id: id,
      md5: md5,
      extension: extension
    })
  }

  mediaFileForTest1({
    id = 'uuid-1',
    md5 = 'md5-1',
    extension = 'png-1'
  }: {
    id?: string
    md5?: string
    extension?: string
  } = {}) {
    return new MediaFile(
      new MediaFileId(id),
      md5,
      extension
    )
  }

  mediaFileForTest2({
    id = 'uuid-2',
    md5 = 'md5-2',
    extension = 'png-2'
  }: {
    id?: string
    md5?: string
    extension?: string
  } = {}) {
    return new MediaFile(
      new MediaFileId(id),
      md5,
      extension
    )
  }

}
