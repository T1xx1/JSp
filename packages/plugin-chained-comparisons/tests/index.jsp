import { describe, expect, it } from 'tester';

describe('plugin-chained-comparisons', () => {
	describe('baseline', () => {
		describe('identifiers', () => {
			const a = 1;
			const b = 2;
			const c = 3;
			const d = 4;

			it('less than', () => {
				expect(a < b < c).toEqual(true);
			});
			it('less equal than', () => {
				expect(a <= b <= c).toEqual(true);
			});
			it('greater than', () => {
				expect(a > b > c).toEqual(false);
			});
			it('greater equal than', () => {
				expect(a >= b >= c).toEqual(false);
			});

			it('3 less than', () => {
				expect(a < b < c < d).toEqual(true);
			});
			it('3 less equal than', () => {
				expect(a <= b <= c <= d).toEqual(true);
			});
			it('3 greater than', () => {
				expect(a > b > c > d).toEqual(false);
			});
			it('3 greater equal than', () => {
				expect(a >= b >= c >= d).toEqual(false);
			});
		});

		describe('expressions', () => {
			const arr = [1, 2, 3, 4];

			it('less than', () => {
				expect(arr[0] < arr[1] < arr[2]).toEqual(true);
			});
			it('less equal than', () => {
				expect(arr[0] <= arr[1] <= arr[2]).toEqual(true);
			});
			it('greater than', () => {
				expect(arr[0] > arr[1] > arr[2]).toEqual(false);
			});
			it('greater equal than', () => {
				expect(arr[0] >= arr[1] >= arr[2]).toEqual(false);
			});

			it('3 less than', () => {
				expect(arr[0] < arr[1] < arr[2] < arr[3]).toEqual(true);
			});
			it('3 less equal than', () => {
				expect(arr[0] <= arr[1] <= arr[2] <= arr[3]).toEqual(true);
			});
			it('3 greater than', () => {
				expect(arr[0] > arr[1] > arr[2] > arr[3]).toEqual(false);
			});
			it('3 greater equal than', () => {
				expect(arr[0] >= arr[1] >= arr[2] >= arr[3]).toEqual(false);
			});
		});
	});
});
