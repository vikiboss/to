import { describe, it, expect } from 'vitest'
import { catchit } from './index'

describe('catchit', () => {
  // 基础同步场景
  describe('synchronous operations', () => {
    it('should handle successful sync operations with return value', () => {
      const [ok, error, value] = catchit(() => 'hello')
      expect(ok).toBe(true)
      expect(error).toBeUndefined()
      expect(value).toBe('hello')
    })

    it('should handle successful sync operations returning undefined', () => {
      const [ok, error, value] = catchit(() => undefined)
      expect(ok).toBe(true)
      expect(error).toBeUndefined()
      expect(value).toBeUndefined()
    })

    it('should handle sync operations throwing Error', () => {
      const testError = new Error('sync error')

      const [ok, error, value] = catchit(() => {
        throw testError
      })

      expect(ok).toBe(false)
      expect(error).toBe(testError)
      expect(value).toBeUndefined()
    })

    it('should handle sync operations throwing non-Error values', () => {
      const testValues = [null, 'error', 404, { code: 500 }]

      testValues.forEach(testValue => {
        const [ok, error, value] = catchit(() => {
          throw testValue
        })

        expect(ok).toBe(false)
        expect(error).toBe(testValue)
        expect(value).toBeUndefined()
      })
    })
  })

  // 异步场景
  describe('asynchronous operations', () => {
    it('should handle resolved Promise with value', async () => {
      const [ok, error, value] = await catchit(() => Promise.resolve(42))
      expect(ok).toBe(true)
      expect(error).toBeUndefined()
      expect(value).toBe(42)
    })

    it('should handle resolved Promise with undefined', async () => {
      const [ok, error, value] = await catchit(() => Promise.resolve(undefined))
      expect(ok).toBe(true)
      expect(error).toBeUndefined()
      expect(value).toBeUndefined()
    })

    it('should handle rejected Promise with Error', async () => {
      const testError = new Error('async error')
      const [ok, error, value] = await catchit(() => Promise.reject(testError))
      expect(ok).toBe(false)
      expect(error).toBe(testError)
      expect(value).toBeUndefined()
    })

    it('should handle rejected Promise with non-Error values', async () => {
      const testValues = [null, 'rejection', 500, { status: 'error' }]

      await Promise.all(
        testValues.map(async testValue => {
          const [ok, error, value] = await catchit(() => Promise.reject(testValue))
          expect(ok).toBe(false)
          expect(error).toBe(testValue)
          expect(value).toBeUndefined()
        })
      )
    })

    it('should handle async/await rejection', async () => {
      const testError = new Error('async await error')
      const [ok, error, value] = await catchit(async () => {
        throw testError
      })
      expect(ok).toBe(false)
      expect(error).toBe(testError)
      expect(value).toBeUndefined()
    })

    it('should handle nested Promises', async () => {
      const [ok, error, value] = await catchit(() =>
        Promise.resolve(Promise.resolve(Promise.resolve('nested')))
      )
      expect(ok).toBe(true)
      expect(error).toBeUndefined()
      expect(value).toBe('nested')
    })
  })

  // 类型系统验证
  describe('type system', () => {
    it('should infer never type for throwing functions', () => {
      const [ok, error, value] = catchit(() => {
        throw new Error('this function never returns')
      })

      if (ok) {
        // 这里 value 应该被推断为 never
        const neverValue: never = value
        expect(neverValue).toBeUndefined() // 实际不会执行
      }
    })

    it('should preserve complex types', () => {
      interface User {
        id: number
        name: string
        age?: number
      }

      const [ok, error, value] = catchit(
        () =>
          ({
            id: 1,
            name: 'John',
            age: 30,
          } as User)
      )

      if (ok) {
        expect(value.id).toBe(1)
        expect(value.name).toBe('John')
        // 验证类型推断
        const _test: User = value
      } else {
        const _test: unknown = error // 验证 error 类型为 unknown
      }
    })

    it('should handle void functions', () => {
      const [ok, error, value] = catchit(() => {
        console.log('no return')
      })

      if (ok) {
        expect(value).toBeUndefined()
        const _test: void = value
      }
    })
  })

  // 边缘案例
  describe('edge cases', () => {
    it('should handle functions returning null', () => {
      const [ok, error, value] = catchit(() => null)
      expect(ok).toBe(true)
      expect(value).toBeNull()
    })

    it('should handle async functions returning null', async () => {
      const [ok, error, value] = await catchit(() => Promise.resolve(null))
      expect(ok).toBe(true)
      expect(value).toBeNull()
    })

    it('should maintain proper this context', () => {
      const context = {
        value: 42,
        getValue() {
          return this.value
        },
      }

      const [ok, error, value] = catchit(() => context.getValue())
      expect(ok).toBe(true)
      expect(value).toBe(42)
    })

    it('should handle functions with arguments (curried)', () => {
      const curriedAdd = (a: number) => (b: number) => a + b
      const [ok, error, value] = catchit(() => curriedAdd(2)(3))
      expect(ok).toBe(true)
      expect(value).toBe(5)
    })
  })
})
