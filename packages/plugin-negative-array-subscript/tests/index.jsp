import { describe, expect, it } from 'tester';

describe('plugin-negative-array-subscript', () => {
		it('should handle negative array subscripts', () => {
			const array = [0, 1, 2, 3, 4];
	describe('baseline', () => {

			expect(array[-1]).toEqual(4);

			array[-1] = 5;

			expect(array).toEqual([0, 1, 2, 3, 5]);
		});
	});
});