export interface UseCase<In, OUT> {
  handle: (input: In) => Promise<OUT>;
}
