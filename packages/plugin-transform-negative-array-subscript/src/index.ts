import { types, type NodePath, type PluginPass } from '@babel/core';
import type { MemberExpression } from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-transform-negative-array-subscript',
		visitor: {
			MemberExpression(path: NodePath<MemberExpression>, state: PluginPass) {
				if (
					path.node.computed &&
					t.isUnaryExpression(path.node.property) &&
					path.node.property.operator === '-'
				) {
					path.node.property = t.binaryExpression(
						'-',
						t.memberExpression(t.cloneNode(path.node.object), t.identifier('length')),
						t.cloneNode(path.node.property.argument),
					);
				}

				/* .at() and .with() */
				if (t.isIdentifier(path.node.property) && path.node.property.name === 'at') {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: 'Prefer negative array subscripts over `.at()`',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
				}
				if (t.isIdentifier(path.node.property) && path.node.property.name === 'with') {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: 'Prefer negative array subscripts over `.with()`',
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
