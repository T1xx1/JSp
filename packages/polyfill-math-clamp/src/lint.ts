import { types } from '@babel/core';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/polyfill-math-clamp-lint',
		visitor: {},
	};
}
