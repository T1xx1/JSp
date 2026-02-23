import { types, type NodePath, type PluginPass } from '@babel/core';
import type { VariableDeclarator } from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-linter-proposals',
		visitor: {
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
