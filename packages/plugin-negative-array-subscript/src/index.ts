export default function ({ types: t }: any) {
	return {
		name: '@jsp/plugin-negative-array-subscript',
		visitor: {
			MemberExpression(path: any) {
				if (
					!path.node.computed ||
					!t.isUnaryExpression(path.node.property) ||
					path.node.property.operator !== '-'
				) {
					return;
				}

				path.node.property = t.binaryExpression(
					'-',
					t.memberExpression(t.cloneNode(path.node.object), t.identifier('length')),
					t.cloneNode(path.node.property.argument),
				);
			},
		},
	};
}
