import { expect, test } from 'tester';

const a = 1;
const b = 2;
const c = 3;
const d = 4;

test('Less than', () => {
	expect(a < b < c).toBe(true);
});
test('Less equal than', () => {
	expect(a <= b <= c).toBe(true);
});
test('Greater than', () => {
	expect(a > b > c).toBe(false);
});
test('Greater equal than', () => {
	expect(a >= b >= c).toBe(false);
});

test('3 less than', () => {
	expect(a < b < c < d).toBe(true);
});
test('3 less equal than', () => {
	expect(a <= b <= c <= d).toBe(true);
});
test('3 greater than', () => {
	expect(a > b > c > d).toBe(false);
});
test('3 greater equal than', () => {
	expect(a >= b >= c >= d).toBe(false);
});
