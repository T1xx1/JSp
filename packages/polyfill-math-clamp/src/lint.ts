import { types, type NodePath, type PluginPass } from '@babel/core';
import type { CallExpression } from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/polyfill-math-clamp-lint',
		visitor: {
			CallExpression(path: NodePath<CallExpression>, state: PluginPass) {
				if (
					t.isMemberExpression(path.node.callee) &&
					t.isIdentifier(path.node.callee.object) &&
					path.node.callee.object.name === 'Math' &&
					t.isIdentifier(path.node.callee.property) &&
					['max', 'min'].includes(path.node.callee.property.name) &&
					path.node.arguments.some((arg) => {
						return (
							t.isCallExpression(arg) &&
							t.isMemberExpression(arg.callee) &&
							t.isIdentifier(arg.callee.object) &&
							arg.callee.object.name === 'Math' &&
							t.isIdentifier(arg.callee.property) &&
							['max', 'min'].includes(arg.callee.property.name)
						);
					})
				) {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: 'Prefer `Math.clamp()` over nested `Math.max()` and `Math.min()`',
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
