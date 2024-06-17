import { NotFoundInRepositoryException } from "../shared/domain-exception..mjs";

export class MediaFileIsNotFoundInRepositoryException extends NotFoundInRepositoryException {
  constructor() {
    super('Media file is not found.')
  }
}
