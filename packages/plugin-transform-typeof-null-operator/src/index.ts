import { types, type NodePath } from '@babel/core';
import type { UnaryExpression } from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-transform-typeof-null-operator',
		visitor: {
			UnaryExpression(path: NodePath<UnaryExpression>) {
				if (path.node.operator !== 'typeof' || !t.isNullLiteral(path.node.argument)) {
					return;
				}

				path.replaceWith(t.stringLiteral('null'));
			},
		},
	};
}
