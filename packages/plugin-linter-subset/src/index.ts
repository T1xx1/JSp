import { types, type NodePath, type PluginPass } from '@babel/core';
import type {
	BinaryExpression,
	CallExpression,
	ClassPrivateProperty,
	Identifier,
	MemberExpression,
	UnaryExpression,
} from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-linter-subset',
		visitor: {
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
						message: '`isNaN()` is a deprecated artifact. Use `Number.isNaN()` instead.',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
				}

				/* require() */
				if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'require') {
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message:
							'`require()` is a deprecated artifact. Use `import` or `createRequire()` instead.',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
				}
			},
			ClassPrivateProperty(path: NodePath<ClassPrivateProperty>, state: PluginPass) {
				/* # private modifier */
				/* @ts-expect-error */
				state.file.ast.errors.push({
					type: 'Error',
					category: 'Semantic',
					message: 'Prefer TypeScript `private` keyword over JavaScript # modifier',
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
						message: '`Date` is a deprecated artifact. Use `Temporal` instead.',
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
					/* @ts-expect-error */
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: '`document.all` is a deprecated artifact',
						loc: {
							line: path.node.loc?.start.line!,
							column: path.node.loc?.start.column!,
						},
					});
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
						message: 'Prefer `parseInt()` or `parseFloat()` over `+` implicit coercion',
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
