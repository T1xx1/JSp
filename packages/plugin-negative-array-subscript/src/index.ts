export default function ({ types: t }: any) {
	return {
		name: '@jsp/plugin-negative-array-subscript',
		visitor: {
			MemberExpression(path: any) {
				if (!t.isUnaryExpression(path.node.property) || path.node.property.operator !== '-') {
					return;
				}

				path.replaceWith(
					t.callExpression(
						t.memberExpression(t.identifier(path.node.object.name), t.identifier('at')),
						[t.unaryExpression('-', t.numericLiteral(path.node.property.argument.value), true)]
					)
				);
			},
		},
	};
}
