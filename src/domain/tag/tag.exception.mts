import { AlreadyExistInRepositoryException, DomainException, NotFoundInRepositoryException, RepositoryException } from "../shared/domain-exception..mjs";

export class TagRepositoryException extends RepositoryException { }

export class TagIsNotFoundInRepositoryException extends NotFoundInRepositoryException {
  constructor() {
    super('Tag is not found.')
  }
}

export class TagAlreadyExistsInRepositoryException extends AlreadyExistInRepositoryException {
  constructor() {
    super('Tag already exists.')
  }
}

export class TagException extends DomainException { }

export class AlreadyAssignedException extends TagException {
  constructor() {
    super('Media file is already assigned.')
  }
}

export class NotAssignedException extends TagException {
  constructor() {
    super('Media file is not assigned.')
  }
}

export class TagNameIsNotEmptyException extends TagException {
  constructor() {
    super('Tag name must not be empty.')
  }
}
