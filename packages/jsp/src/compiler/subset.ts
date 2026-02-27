import { types, type NodePath, type PluginPass } from '@babel/core';
import type {
	BinaryExpression,
	CallExpression,
	ClassPrivateProperty,
	Identifier,
	MemberExpression,
	Program,
	SourceLocation,
	UnaryExpression,
} from '@babel/types';

import { Babel } from './_.js';

export function lintSubsetVisitor({ types: t }: { types: typeof types }) {
	return {
		visitor: {
			Program(path: NodePath<Program>, state: PluginPass) {
				const allComments =
					/* @ts-expect-error */
					path.hub.file.ast.comments ??
					([] as {
						value: string;
						loc: SourceLocation;
					}[]);

				for (const comment of allComments) {
					if (comment.value.includes('@ts-check')) {
						/* @ts-expect-error */
						state.file.ast.errors.push(
							Babel.createIntegratedJspDiagnostic({
								type: 'Error',
								category: 'Semantic',
								message: 'JS+ is typechecked by default',
								loc: {
									startLine: comment.loc?.start.line!,
									startCharacter: comment.loc?.start.column!,
									endLine: comment.loc?.end.line!,
									endCharacter: comment.loc?.end.column! + 1,
								},
							}),
						);
					}
					if (comment.value.includes('@ts-nocheck')) {
						/* @ts-expect-error */
						state.file.ast.errors.push(
							Babel.createIntegratedJspDiagnostic({
								type: 'Error',
								category: 'Semantic',
								message: 'In JS+ typechecking cannot be turned off',
								loc: {
									startLine: comment.loc?.start.line!,
									startCharacter: comment.loc?.start.column!,
									endLine: comment.loc?.end.line!,
									endCharacter: comment.loc?.end.column! + 1,
								},
							}),
						);
					}
					if (comment.value.includes('@ts-ignore')) {
						/* @ts-expect-error */
						state.file.ast.errors.push(
							Babel.createIntegratedJspDiagnostic({
								type: 'Error',
								category: 'Semantic',
								message: '`@ts-ignore` is a deprecated artifact. Use `@ts-expect-error` instead',
								loc: {
									startLine: comment.loc?.start.line!,
									startCharacter: comment.loc?.start.column!,
									endLine: comment.loc?.end.line!,
									endCharacter: comment.loc?.end.column! + 1,
								},
							}),
						);
					}
				}
			},
			BinaryExpression(path: NodePath<BinaryExpression>, state: PluginPass) {
				/* 0/0 */
				if (
					path.node.operator === '/' &&
					t.isNumericLiteral(path.node.left) &&
					path.node.left.value === 0 &&
					t.isNumericLiteral(path.node.right) &&
					path.node.right.value === 0
				) {
					/* @ts-expect-error */
					state.file.ast.errors.push(
						Babel.createIntegratedJspDiagnostic({
							type: 'Error',
							category: 'Semantic',
							message: "`0/0` doesn't make sense",
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
				/* isNaN() */
				if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'isNaN') {
					/* @ts-expect-error */
					state.file.ast.errors.push(
						Babel.createIntegratedJspDiagnostic({
							type: 'Error',
							category: 'Semantic',
							message: '`isNaN()` is a deprecated artifact. Use `Number.isNaN()` instead',
							loc: {
								startLine: path.node.loc?.start.line!,
								startCharacter: path.node.loc?.start.column!,
								endLine: path.node.loc?.end.line!,
								endCharacter: path.node.loc?.end.column! + 1,
							},
						}),
					);
				}

				/* require() */
				if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'require') {
					throw Babel.throwIntegratedJspSyntaxError(
						'`JS+ does not support CommonJS. Use ESM `import`s instead',
						{
							startLine: path.node.loc?.start.line!,
							startCharacter: path.node.loc?.start.column!,
							endLine: path.node.loc?.end.line!,
							endCharacter: path.node.loc?.end.column! + 1,
						},
					);
				}
			},
			ClassPrivateProperty(path: NodePath<ClassPrivateProperty>, state: PluginPass) {
				/* # private modifier */
				/* @ts-expect-error */
				state.file.ast.errors.push(
					Babel.createIntegratedJspDiagnostic({
						type: 'Error',
						category: 'Semantic',
						message:
							"Don't use JavaScript # private modifier. Prefer TypeScript `private` keyword instead",
						loc: {
							startLine: path.node.loc?.start.line!,
							startCharacter: path.node.loc?.start.column!,
							endLine: path.node.loc?.end.line!,
							endCharacter: path.node.loc?.end.column! + 1,
						},
					}),
				);
			},
			MemberExpression(path: NodePath<MemberExpression>, state: PluginPass) {
				/* Date */
				if (t.isIdentifier(path.node.object) && path.node.object.name === 'Date') {
					/* @ts-expect-error */
					state.file.ast.errors.push(
						Babel.createIntegratedJspDiagnostic({
							type: 'Error',
							category: 'Semantic',
							message: '`Date` is a deprecated artifact. Use `Temporal` instead',
							loc: {
								startLine: path.node.loc?.start.line!,
								startCharacter: path.node.loc?.start.column!,
								endLine: path.node.loc?.end.line!,
								endCharacter: path.node.loc?.end.column! + 1,
							},
						}),
					);
				}

				/* document.all */
				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'document' &&
					t.isIdentifier(path.node.property) &&
					path.node.property.name === 'all'
				) {
					throw Babel.throwIntegratedJspSyntaxError('`document.all` is a deprecated artifact', {
						startLine: path.node.loc?.start.line!,
						startCharacter: path.node.loc?.start.column!,
						endLine: path.node.loc?.end.line!,
						endCharacter: path.node.loc?.end.column! + 1,
					});
				}

				/* module.exports */
				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'module' &&
					t.isIdentifier(path.node.property) &&
					path.node.property.name === 'exports'
				) {
					throw Babel.throwIntegratedJspSyntaxError(
						'JS+ does not support CommonJS. Use ESM `export`s instead',
						{
							startLine: path.node.loc?.start.line!,
							startCharacter: path.node.loc?.start.column!,
							endLine: path.node.loc?.end.line!,
							endCharacter: path.node.loc?.end.column! + 1,
						},
					);
				}
			},
			Identifier(path: NodePath<Identifier>, state: PluginPass) {
				/* undefined */
				if (path.node.name === 'undefined' && !t.isTSUndefinedKeyword(path.parent)) {
					/* @ts-expect-error */
					state.file.ast.errors.push(
						Babel.createIntegratedJspDiagnostic({
							type: 'Error',
							category: 'Semantic',
							message:
								'`undefined` should not be used explicitly. For nullish initializations use `null` instead',
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
			UnaryExpression(path: NodePath<UnaryExpression>, state: PluginPass) {
				/* + number coercion */
				if (path.node.operator === '+' && t.isStringLiteral(path.node.argument)) {
					/* @ts-expect-error */
					state.file.ast.errors.push(
						Babel.createIntegratedJspDiagnostic({
							type: 'Error',
							category: 'Semantic',
							message:
								"Don't implicitly coerce strings with `+`. Use `parseInt()` or `parseFloat()` instead",
							loc: {
								startLine: path.node.loc?.start.line!,
								startCharacter: path.node.loc?.start.column!,
								endLine: path.node.loc?.end.line!,
								endCharacter: path.node.loc?.end.column! + 1,
							},
						}),
					);
				}

				/* -0 */
				if (
					path.node.operator === '-' &&
					t.isNumericLiteral(path.node.argument) &&
					path.node.argument.value === 0
				) {
					/* @ts-expect-error */
					state.file.ast.errors.push(
						Babel.createIntegratedJspDiagnostic({
							type: 'Error',
							category: 'Semantic',
							message: "`-0` doesn't make sense. Use `0` instead",
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
