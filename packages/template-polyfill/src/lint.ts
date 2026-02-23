import { types, type NodePath } from '@babel/core';
import type { Identifier } from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/template-polyfill-lint',
		visitor: {
			Identifier(path: NodePath<Identifier>) {
				path.replaceWith(t.identifier(path.node.name.split('').reverse().join('')));
			},
		},
	};
}
