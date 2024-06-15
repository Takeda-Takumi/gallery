import { TagName } from "./tagName.mjs"

describe('TagName', () => {
  test('空文字列はエラー', () => {
    expect(() => new TagName('')).toThrow()
  })
})
