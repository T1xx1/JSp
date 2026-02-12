# Chained comparisons transform plugin

> [Docs](https://jsplang.vercel.app/language/runtime/chainedcomparisons)

```jsp
const a = 1;
const b = 2;
const c = 3;

console.log(a < b < c); // true
console.log(a >= b <= c); // false
```

```ts
const a = 1;
const b = 2;
const c = 3;

console.log(a < b && b < c); // true
console.log(a >= b && b <= c); // false
```
