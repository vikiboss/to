# catchit

一个优雅的 TypeScript 错误处理工具库。

## 特性

- 🎯 类型安全：完整的 TypeScript 类型支持
- 🚀 轻量级：零依赖
- ⚡️ 支持同步和异步函数
- 📦 支持 ESM 和 CommonJS

## 安装

```bash
npm install catchit
```

## 使用方法

```typescript
import { tryCatch } from 'catchit';

// 同步使用
const [ok, error, value] = tryCatch(() => {
  return "hello world";
});

if (ok) {
  console.log(value); // value 类型为 string
} else {
  console.error(error);
}

// 异步使用
const [ok, error, value] = await tryCatch(async () => {
  const response = await fetch('https://api.example.com');
  return response.json();
});

if (ok) {
  console.log(value); // value 类型为 API 返回的类型
} else {
  console.error(error);
}
 ```

## API

### tryCatch

```typescript
function tryCatch<T>(fn: () => Promise<T>): Promise<TryRunResult<T>>
function tryCatch<T>(fn: () => T): TryRunResult<T>
```

返回一个元组，包含三个值：

- ok : boolean - 表示操作是否成功
- error : unknown | undefined - 如果操作失败，包含错误信息
- value : T | undefined - 如果操作成功，包含返回值

## License

MIT
