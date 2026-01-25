import { describe, expect, it } from 'tester';

describe('plugin-typeof-null-operator', () => {
	describe('baseline', () => {
		it('should replace `typeof null` with `null`', () => {
			expect(typeof null).toEqual('null');
		});
	});
});
