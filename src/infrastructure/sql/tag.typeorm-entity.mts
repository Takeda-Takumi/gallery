import { Tag } from "../../domain/tag/tag.entity.mjs";

type PropertyNamesExcludeMethods<Base, FilterType> = {
  [Key in keyof Base]: Base[Key] extends FilterType ? never : Key
}[keyof Base];

type PropertyName = PropertyNamesExcludeMethods<Tag, (...arg: any) => any>

type TagColumn = {
  [K in PropertyName]: any
}

class TypeOrmTag implements TagColumn {
  id: string
  name: string
  mediaFiles: string
}
