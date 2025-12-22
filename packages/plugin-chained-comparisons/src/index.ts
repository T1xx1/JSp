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
					path.replaceWith(
						t.logicalExpression(
							'&&',
							path.node.left,
							t.binaryExpression(path.node.operator, path.node.left.right, path.node.right)
						)
					);
				}
			},
		},
	};
}
