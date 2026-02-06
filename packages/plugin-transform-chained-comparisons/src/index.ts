import { types, type NodePath } from '@babel/core';
import type { BinaryExpression } from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsp/plugin-transform-chained-comparisons',
		visitor: {
			BinaryExpression(path: NodePath<BinaryExpression>) {
				const comparisons = ['==', '!=', '===', '!==', '<', '<=', '>', '>='];

				if (!comparisons.includes(path.node.operator)) {
					return;
				}

				if (t.isBinaryExpression(path.node.left) && comparisons.includes(path.node.left.operator)) {
					path.replaceWith(
						t.logicalExpression(
							'&&',
							path.node.left,
							t.binaryExpression(path.node.operator, path.node.left.right, path.node.right),
						),
					);
				}
			},
		},
	};
}
