import { types, type NodePath, type PluginPass } from '@babel/core';
import type { CallExpression, VariableDeclarator } from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-linter-proposals',
		visitor: {
			CallExpression(path: NodePath<CallExpression>, state: PluginPass) {
				/* async do expressions */
				if (
					t.isFunctionExpression(path.node.callee) ||
					t.isArrowFunctionExpression(path.node.callee)
				) {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: 'Prefer `async do` expressions over IIFEs',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
				}
			},
			VariableDeclarator(path: NodePath<VariableDeclarator>, state: PluginPass) {
				/* do expressions */
				if (t.isConditionalExpression(path.node.init)) {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: 'Prefer `do` expressions over ternaries for variable declarations',
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
