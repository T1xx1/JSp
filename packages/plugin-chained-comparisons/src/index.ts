export default function ({ types: t }: any) {
	return {
		name: '@jsp/plugin-chained-comparisons',
		visitor: {
			BinaryExpression(path: any) {
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
							t.binaryExpression(path.node.operator, tempId, path.node.right)
						)
					);
				}
			},
		},
	};
}
