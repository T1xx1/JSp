import { expect, test } from 'tester';

test('Baseline', () => {
	const array = [0, 1, 2, 3];

	expect(array[-1]).toBe(3);

	array[-1] = 4;

	expect(array).toEqual([0, 1, 2, 4]);
});
