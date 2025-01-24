type ToResult<T> =
  | readonly [ok: true, error: undefined, value: T]
  | readonly [ok: false, error: unknown, value: undefined]

/**
 * Safely executes a synchronous or asynchronous function, returning a result tuple.
 *
 * @param fn The function to execute, which can be synchronous or return a Promise
 * @returns For synchronous functions: a result tuple
 * @returns For async functions: a Promise that resolves to a result tuple
 */
export function to<T>(fn: () => never): ToResult<never>
export function to<T>(fn: () => Promise<T>): Promise<ToResult<T>>
export function to<T>(fn: () => T): ToResult<T>
export function to<T>(fn: () => T | Promise<T>): ToResult<T> | Promise<ToResult<T>> {
  try {
    const result = fn()

    return isPromise(result) ? handleAsyncPromise(result) : ([true, undefined, result] as const)
  } catch (error) {
    return [false, error, undefined] as const
  }
}

function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise
}

function handleAsyncPromise<T>(promise: Promise<T>): Promise<ToResult<T>> {
  return promise.then(
    value => [true, undefined, value] as const,
    error => [false, error, undefined] as const
  )
}
