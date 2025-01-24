# @vikiboss/to

An elegant TypeScript error handling utility library, alternative to [Try Statements](https://github.com/arthurfiorette/proposal-try-statements) proposal.

## Features

- 🎯 Type Safety: Full TypeScript type support
- 🚀 Lightweight: Zero dependencies
- ⚡️ Dual Support: Handles both synchronous and asynchronous operations
- 📦 Module Ready: Compatible with ESM and CommonJS

## Installation

```bash
npm install @vikiboss/to
```

## Usage
```typescript
import { to } from '@vikiboss/to';

// Synchronous usage
const [ok, error, value] = to(() => {
  return "hello world";
});

if (ok) {
  console.log(value); // value is typed as string
} else {
  console.error(error);
}

// Asynchronous usage
const [ok, error, value] = await to(async () => {
  const response = await fetch('https://api.example.com');
  return response.json();
});

if (ok) {
  console.log(value); // value inherits the return type from API
} else {
  console.error(error);
}
```

## API

### to

```typescript
type ToResult<T> =
  | readonly [ok: true, error: undefined, value: T]
  | readonly [ok: false, error: unknown, value: undefined]

/**
 * Safely executes a synchronous or asynchronous function, returning a result tuple.
 *
 * @param fn - Function to execute (sync or Promise-returning)
 * @returns Tuple containing:
 *          - ok: Execution status (boolean)
 *          - error: Captured error (undefined if successful)
 *          - value: Result value (undefined if failed)
 * 
 * For synchronous functions: Immediate result tuple
 * For async functions: Promise resolving to result tuple
 */
export function to<T>(fn: () => never): ToResult<never>
export function to<T>(fn: () => Promise<T>): Promise<ToResult<T>>
export function to<T>(fn: () => T): ToResult<T>
```


##### Return Value

A tuple containing three elements:

- ok: Boolean indicating operation success
- error: unknown | undefined error object (present when ok is false)
- value: T | undefined result value (present when ok is true)

## License

MIT
