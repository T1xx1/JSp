import { types, type NodePath } from '@babel/core';
import type { BinaryExpression } from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsp/plugin-chained-comparisons',
		visitor: {
			BinaryExpression(path: NodePath<BinaryExpression>) {
				const comparisons = ['>', '>=', '<', '<='];

				if (!comparisons.includes(path.node.operator)) {
					return;
				}

				if (t.isBinaryExpression(path.node.left) && comparisons.includes(path.node.left.operator)) {
					const leftSide = path.node.left;

					const tempId = path.scope.generateUidIdentifier('cache');
					path.scope.push({ id: tempId });

					leftSide.right = t.assignmentExpression('=', tempId, leftSide.right);

					path.replaceWith(
						t.logicalExpression(
							'&&',
							leftSide,
							t.binaryExpression(path.node.operator, tempId, path.node.right),
						),
					);
				}
			},
		},
	};
}
