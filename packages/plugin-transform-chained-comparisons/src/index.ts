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

				const leftSide = path.node.left;

				if (t.isBinaryExpression(leftSide) && comparisons.includes(leftSide.operator)) {
					path.replaceWith(
						t.logicalExpression(
							'&&',
							leftSide,
							t.binaryExpression(path.node.operator, leftSide.right, path.node.right),
						),
					);
				}
			},
		},
	};
}
