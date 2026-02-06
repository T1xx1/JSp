import { describe, expect, it } from 'tester';

describe('baseline', () => {
	it('equal', () => {
		expect(1 == 1 == 1).toEqual(true);
	});
	it('not equal', () => {
		expect(1 != 1 != 1).toEqual(false);
	});
	it('strict equal', () => {
		expect(1 === 1 === 1).toEqual(true);
	});
	it('strict not equal', () => {
		expect(1 !== 1 !== 1).toEqual(false);
	});
	it('less than', () => {
		expect(1 < 2 < 3).toEqual(true);
	});
	it('less equal than', () => {
		expect(1 <= 2 <= 3).toEqual(true);
	});
	it('greater than', () => {
		expect(1 > 2 > 3).toEqual(false);
	});
	it('greater equal than', () => {
		expect(1 >= 2 >= 3).toEqual(false);
	});

	it('3 equal', () => {
		expect(1 == 1 == 1 == 1).toEqual(true);
	});
	it('3 not equal', () => {
		expect(1 != 1 != 1 != 1).toEqual(false);
	});
	it('3 strict equal', () => {
		expect(1 === 1 === 1 === 1).toEqual(true);
	});
	it('3 strict not equal', () => {
		expect(1 !== 1 !== 1 !== 1).toEqual(false);
	});
	it('3 less than', () => {
		expect(1 < 2 < 3 < 4).toEqual(true);
	});
	it('3 less equal than', () => {
		expect(1 <= 2 <= 3 <= 4).toEqual(true);
	});
	it('3 greater than', () => {
		expect(1 > 2 > 3 > 4).toEqual(false);
	});
	it('3 greater equal than', () => {
		expect(1 >= 2 >= 3 >= 4).toEqual(false);
	});

	describe('identifiers', () => {
		const a = 1;
		const b = 2;
		const c = 3;
		const d = 4;

		it('equal', () => {
			expect(a == a == a).toEqual(true);
		});
		it('not equal', () => {
			expect(a != a != a).toEqual(false);
		});
		it('strict equal', () => {
			expect(a === a === a).toEqual(true);
		});
		it('strict not equal', () => {
			expect(a !== a !== a).toEqual(false);
		});
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

		it('3 equal', () => {
			expect(a == a == a == a).toEqual(true);
		});
		it('3 not equal', () => {
			expect(a != a != a != a).toEqual(false);
		});
		it('3 strict equal', () => {
			expect(a === a === a === a).toEqual(true);
		});
		it('3 strict not equal', () => {
			expect(a !== a !== a !== a).toEqual(false);
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

		it('equal', () => {
			expect(arr[0] == arr[0] == arr[0]).toEqual(true);
		});
		it('not equal', () => {
			expect(arr[0] != arr[0] != arr[0]).toEqual(false);
		});
		it('strict equal', () => {
			expect(arr[0] === arr[0] === arr[0]).toEqual(true);
		});
		it('strict not equal', () => {
			expect(arr[0] !== arr[0] !== arr[0]).toEqual(false);
		});
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

		it('3 equal', () => {
			expect(arr[0] == arr[0] == arr[0] == arr[0]).toEqual(true);
		});
		it('3 not equal', () => {
			expect(arr[0] != arr[0] != arr[0] != arr[0]).toEqual(false);
		});
		it('3 strict equal', () => {
			expect(arr[0] === arr[0] === arr[0] === arr[0]).toEqual(true);
		});
		it('3 strict not equal', () => {
			expect(arr[0] !== arr[0] !== arr[0] !== arr[0]).toEqual(false);
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
