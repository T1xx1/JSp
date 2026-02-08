import { types, type NodePath } from '@babel/core';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-template',
		visitor: {},
	};
}
