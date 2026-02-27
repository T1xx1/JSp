import { types, type NodePath, type PluginPass } from '@babel/core';
import { type ArrayPattern, type CallExpression, type VariableDeclarator } from '@babel/types';

import { Babel } from './_.js';

export function lintProposalsVisitor({ types: t }: { types: typeof types }) {
	return {
		visitor: {
			ArrayPattern(path: NodePath<ArrayPattern>, state: PluginPass) {
				/* discard bindings */
				if (path.node.elements.includes(null)) {
					/* @ts-expect-error */
					state.file.ast.errors.push(
						Babel.createIntegratedJspDiagnostic({
							type: 'Error',
							category: 'Semantic',
							message: 'Prefer `void` discard binding over empty identifiers',
							loc: {
								startLine: path.node.loc?.start.line!,
								startCharacter: path.node.loc?.start.column!,
								endLine: path.node.loc?.end.line!,
								endCharacter: path.node.loc?.end.column! + 1,
							},
						}),
					);
				}
				if (
					path.node.elements
						.filter((identifier) => {
							if (t.isIdentifier(identifier)) {
								return identifier.name;
							}
						})
						.join('')
						.includes('_')
				) {
					/* @ts-expect-error */
					state.file.ast.errors.push(
						Babel.createIntegratedJspDiagnostic({
							type: 'Error',
							category: 'Semantic',
							message: 'Prefer `void` discard binding over underscored identifiers',
							loc: {
								startLine: path.node.loc?.start.line!,
								startCharacter: path.node.loc?.start.column!,
								endLine: path.node.loc?.end.line!,
								endCharacter: path.node.loc?.end.column! + 1,
							},
						}),
					);
				}
			},
			CallExpression(path: NodePath<CallExpression>, state: PluginPass) {
				/* async do expressions */
				if (
					t.isFunctionExpression(path.node.callee) ||
					t.isArrowFunctionExpression(path.node.callee)
				) {
					/* @ts-expect-error */
					state.file.ast.errors.push(
						Babel.createIntegratedJspDiagnostic({
							type: 'Error',
							category: 'Semantic',
							message: 'Prefer `async do` expressions over IIFEs',
							loc: {
								startLine: path.node.loc?.start.line!,
								startCharacter: path.node.loc?.start.column!,
								endLine: path.node.loc?.end.line!,
								endCharacter: path.node.loc?.end.column! + 1,
							},
						}),
					);
				}
			},
			VariableDeclarator(path: NodePath<VariableDeclarator>, state: PluginPass) {
				/* do expressions */
				if (t.isConditionalExpression(path.node.init)) {
					/* @ts-expect-error */
					state.file.ast.errors.push(
						Babel.createIntegratedJspDiagnostic({
							type: 'Error',
							category: 'Semantic',
							message: 'Prefer `do` expressions over ternaries for variable declarations',
							loc: {
								startLine: path.node.loc?.start.line!,
								startCharacter: path.node.loc?.start.column!,
								endLine: path.node.loc?.end.line!,
								endCharacter: path.node.loc?.end.column! + 1,
							},
						}),
					);
				}
			},
		},
	};
}
