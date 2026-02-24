import { types, type NodePath, type PluginPass } from '@babel/core';
import type { MemberExpression } from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/polyfill-random-namespace-lint',
		visitor: {
			MemberExpression(path: NodePath<MemberExpression>, state: PluginPass) {
				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'Math' &&
					t.isIdentifier(path.node.property) &&
					path.node.property.name === 'random'
				) {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: 'Prefer `Random.random()` over `Math.random()`',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
				}
			},
		},
	};
}
