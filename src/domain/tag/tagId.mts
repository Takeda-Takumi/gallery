export class TagId {
  public readonly id: string
  constructor(id: string) {
    if (id === '') throw new Error()
    this.id = id
  }

  // equals(tagId: TagId) {
  //   return this.value === tagId.value
  // }

  toString() {
    return this.id
  }

}
