export default function ({ types: t }: any) {
	return {
		name: '@jsp/plugin-typeof-null-operator',
		visitor: {
			UnaryExpression(path: any) {
				if (path.node.operator !== 'typeof' || path.node.argument.type !== 'NullLiteral') {
					return;
				}

				path.replaceWith(t.expressionStatement(t.stringLiteral('null')));
			},
		},
	};
}
