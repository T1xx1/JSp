import { types } from '@babel/core';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/polyfill-random-namespace-lint',
		visitor: {},
	};
}
