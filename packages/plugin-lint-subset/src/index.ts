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

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-lint-subset',
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
						state.file.ast.errors.push({
							type: 'Error',
							category: 'Semantic',
							message: 'JS+ is typechecked by default',
							loc: {
								line: path.node.loc?.start.line!,
								column: path.node.loc?.start.column!,
							},
						});
					}
					if (comment.value.includes('@ts-nocheck')) {
						/* @ts-expect-error */
						state.file.ast.errors.push({
							type: 'Error',
							category: 'Semantic',
							message: 'JS+ is typechecked by default',
							loc: {
								line: path.node.loc?.start.line!,
								column: path.node.loc?.start.column!,
							},
						});
					}
					if (comment.value.includes('@ts-ignore')) {
						/* @ts-expect-error */
						state.file.ast.errors.push({
							type: 'Error',
							category: 'Semantic',
							message: '`@ts-ignore` is a deprecated artifact. Use `@ts-expect-error` instead',
							loc: {
								line: path.node.loc?.start.line!,
								column: path.node.loc?.start.column!,
							},
						});
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
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: "`0/0` doesn't make sense",
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
				}
			},
			CallExpression(path: NodePath<CallExpression>, state: PluginPass) {
				/* isNaN() */
				if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'isNaN') {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: '`isNaN()` is a deprecated artifact. Use `Number.isNaN()` instead',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
				}

				/* require() */
				if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'require') {
					throw {
						type: 'Error',
						category: 'Syntax',
						message: '`JS+ does not support CommonJS. Use ESM `import`s instead',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					};
				}
			},
			ClassPrivateProperty(path: NodePath<ClassPrivateProperty>, state: PluginPass) {
				/* # private modifier */
				/* @ts-expect-error */
				state.file.ast.errors.push({
					type: 'Error',
					category: 'Semantic',
					message:
						"Don't use JavaScript # private modifier. Prefer TypeScript `private` keyword instead",
					loc: {
						line: path.node.loc?.start.line!,
						column: path.node.loc?.start.column!,
					},
				});
			},
			MemberExpression(path: NodePath<MemberExpression>, state: PluginPass) {
				/* Date */
				if (t.isIdentifier(path.node.object) && path.node.object.name === 'Date') {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: '`Date` is a deprecated artifact. Use `Temporal` instead',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
				}

				/* document.all */
				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'document' &&
					t.isIdentifier(path.node.property) &&
					path.node.property.name === 'all'
				) {
					throw {
						type: 'Error',
						category: 'Syntax',
						message: '`document.all` is a deprecated artifact',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					};
				}

				/* module.exports */
				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'module' &&
					t.isIdentifier(path.node.property) &&
					path.node.property.name === 'exports'
				) {
					throw {
						type: 'Error',
						category: 'Syntax',
						message: 'JS+ does not support CommonJS. Use ESM `export`s instead',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					};
				}
			},
			Identifier(path: NodePath<Identifier>, state: PluginPass) {
				/* undefined */
				if (path.node.name === 'undefined' && !t.isTSUndefinedKeyword(path.parent)) {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message:
							'`undefined` should not be used explicitly. For nullish initializations use `null` instead',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
				}
			},
			UnaryExpression(path: NodePath<UnaryExpression>, state: PluginPass) {
				/* + number coercion */
				if (path.node.operator === '+' && t.isStringLiteral(path.node.argument)) {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message:
							"Don't implicitly coerce strings with `+`. Use `parseInt()` or `parseFloat()` instead",
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
				}

				/* -0 */
				if (
					path.node.operator === '-' &&
					t.isNumericLiteral(path.node.argument) &&
					path.node.argument.value === 0
				) {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: "`-0` doesn't make sense. Use `0` instead",
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
