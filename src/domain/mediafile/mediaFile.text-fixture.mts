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

  imageFileForTest() {
    const minimum_png = Buffer.from('89504E470D0A1A0A0000000D49484452000000010000000108000000003A7E9B550000000A49444154081D63F80F0001010100365F67800000000049454E44AE426082', 'hex')
    const hash = 'd9a9186ca60ef28a0f8df9a9bc4d337e'

    return {
      file: minimum_png,
      hash: hash
    }
  }

}
