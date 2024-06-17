export class DomainException extends Error { }

export class ValidationDomainException extends DomainException { }

export class RepositoryException extends DomainException { }

export class NotFoundInRepositoryException extends RepositoryException { }

export class AlreadyExistInRepositoryException extends RepositoryException { }
