# Chained comparisons transform plugin

```js+
const a = 1;
const b = 2;
const c = 3;

console.log(a < b < c); // true
console.log(a >= b <= c); // false
```

```js
const a = 1;
const b = 2;
const c = 3;

console.log(a < b && b < c); // true
console.log(a >= b && b <= c); // false
```
