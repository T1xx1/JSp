import { types, type NodePath } from '@babel/core';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsp/plugin-template',
		visitor: {},
	};
}
