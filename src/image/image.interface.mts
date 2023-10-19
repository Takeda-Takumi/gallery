export interface Image {
  readonly md5: string;
  readonly extension: string;
  readonly file: Buffer | string;
}
