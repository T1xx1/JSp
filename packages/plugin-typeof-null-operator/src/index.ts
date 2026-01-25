export default function ({ types: t }: any) {
	return {
		name: '@jsp/plugin-typeof-null-operator',
		visitor: {
			UnaryExpression(path: any) {
				if (path.node.operator !== 'typeof' || !t.isNullLiteral(path.node.argument)) {
					return;
				}

				path.replaceWith(t.stringLiteral('null'));
			},
		},
	};
}
