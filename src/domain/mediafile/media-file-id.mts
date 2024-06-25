export class MediaFileId {
  readonly id: string
  constructor(id: string) {
    if (id === '') throw new Error()
    if (id === undefined || id === null) throw new Error()
    this.id = id
  }
}
