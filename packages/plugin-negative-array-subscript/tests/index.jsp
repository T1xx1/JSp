import { describe, expect, it } from 'tester';

describe('baseline', () => {
	it('negative array subscript', () => {
		const array = [0, 1, 2, 3, 4];

		expect(array[-1]).toEqual(4);

		array[-1] = 5;

		expect(array).toEqual([0, 1, 2, 3, 5]);
	});
	it('negative matrix subscript', () => {
		const matrix = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
		];

		expect(matrix[-1][-1]).toEqual(8);

		matrix[-1][-1] = 9;

		expect(matrix).toEqual([
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 9],
		]);
	});

	describe('identifiers', () => {
		it('explicit negative subscript', () => {
			const array = [0, 1, 2, 3, 4];
			const x = 1;

			expect(array[-x]).toEqual(4);

			array[-x] = 5;

			expect(array).toEqual([0, 1, 2, 3, 5]);
		});
		it('explicit matrix negative subscript', () => {
			const matrix = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
			];
			const x = 1;
			const y = 1;

			expect(matrix[-x][-y]).toEqual(8);

			matrix[-x][-y] = 9;

			expect(matrix).toEqual([
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 9],
			]);
		});

		it('implicit negative subscript', () => {
			const array = [0, 1, 2, 3, 4];
			const x = -1;

			expect(array[x]).toEqual(undefined);

			/* array[x] = 5;

			expect(array).toEqual(['-1': 5, 0, 1, 2, 3, 4]); */
		});
		it('implicit matrix negative subscript', () => {
			const matrix = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
			];
			const x = -1;
			const y = -1;

			expect(() => {
				matrix[x][y];
			}).toThrowError("Cannot read properties of undefined (reading '-1')");

			/* matrix[x][y] = 9;

			expect(matrix).toEqual([
				['-1': 9, 0, 1, 2],
				[3, 4, 5],
				[6, 7, 8]
			]); */
		});
	});

	describe('expressions', () => {
		it('explicit negative subscript', () => {
			const array = [0, 1, 2, 3, 4];
			const x = 2;

			expect(array[-(x - 1)]).toEqual(4);

			array[-(x - 1)] = 5;

			expect(array).toEqual([0, 1, 2, 3, 5]);
		});
		it('explicit matrix negative subscript', () => {
			const matrix = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
			];
			const x = 2;
			const y = 2;

			expect(matrix[-(x - 1)][-(y - 1)]).toEqual(8);

			matrix[-(x - 1)][-(y - 1)] = 9;

			expect(matrix).toEqual([
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 9],
			]);
		});

		it('implicit negative subscript', () => {
			const array = [0, 1, 2, 3, 4];
			const x = 1;

			expect(array[x - 2]).toEqual(undefined);

			/* array[x - 2] = 5;

			expect(array).toEqual(['-1': 5, 0, 1, 2, 3, 4]); */
		});
		it('implicit matrix negative subscript', () => {
			const matrix = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
			];
			const x = 1;
			const y = 1;

			expect(() => {	
				matrix[x - 2][y - 2];
			}).toThrowError("Cannot read properties of undefined (reading '-1')");

			/* matrix[x - 2][y - 2] = 9;

			expect(matrix).toEqual([
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8]
			]); */
		});
	});
});

describe('compatibility', () => {
	it('should not break negative numeric literals in expression statements', () => {
		expect(1 + -1).toEqual(0);
		expect(-1 + 1).toEqual(0);
		expect(1 - -1).toEqual(2);
		expect(-1 - 1).toEqual(-2);
	});

	it('should not break object member expressions', () => {
		let obj = {
			boolean: true,
			number: 1,
			string: 'value',
		}

		expect(obj.boolean).toEqual(true);
		expect(obj.number).toEqual(1);
		expect(obj.string).toEqual('value');
	})
});
