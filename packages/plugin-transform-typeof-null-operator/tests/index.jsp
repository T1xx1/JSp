import { describe, expect, it } from '@jsplang/tester';

describe('baseline', () => {
	it('should replace `typeof null` with `null`', () => {
		expect(typeof null).toEqual('null');
	});
});