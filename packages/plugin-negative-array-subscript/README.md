# Negative array subscript plugin

```js+
const array = [0, 1, 2, 3];

console.log(array[-1]); // 3

array[-1] = 4; // [0, 1, 2, 4]
```

```js
const array = [0, 1, 2, 3];

console.log(array[array.length - 1]); // 3

array[array.length - 1] = 4; // [0, 1, 2, 4]
```
