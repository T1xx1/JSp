import { types, type NodePath, type PluginPass } from '@babel/core';
import type {
	BinaryExpression,
	CallExpression,
	ClassPrivateProperty,
	Identifier,
	MemberExpression,
	SourceLocation,
	UnaryExpression,
	VariableDeclarator,
} from '@babel/types';

export type State = PluginPass & {
	file: {
		ast: {
			errors: {
				type: 'Warning' | 'Error';
				category: 'Semantic';
				message: string;
				loc: {
					line: number;
					column: number;
				};
			}[];
		};
	};
};

export const loc = (
	l: undefined | null | SourceLocation,
): {
	line: number;
	column: number;
} => {
	return {
		line: l?.start.line!,
		column: l?.start.column!,
	};
};

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-linter',
		visitor: {
			BinaryExpression(path: NodePath<BinaryExpression>, state: State) {
				/* 0/0 */
				if (
					path.node.operator === '/' &&
					t.isNumericLiteral(path.node.left) &&
					path.node.left.value === 0 &&
					t.isNumericLiteral(path.node.right) &&
					path.node.right.value === 0
				) {
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: "`0/0` doesn't make sense",
						loc: loc(path.node.loc),
					});
				}
			},
			CallExpression(path: NodePath<CallExpression>, state: State) {
				/* require() */
				if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'require') {
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message:
							'`require()` is a deprecated artifact. Use `import` or `createRequire()` instead.',
						loc: loc(path.node.loc),
					});
				}
			},
			ClassPrivateProperty(path: NodePath<ClassPrivateProperty>, state: State) {
				/* # modifier */
				state.file.ast.errors.push({
					type: 'Error',
					category: 'Semantic',
					message: 'Prefer TypeScript `private` keyword over JavaScript # modifier',
					loc: loc(path.node.loc),
				});
			},
			MemberExpression(path: NodePath<MemberExpression>, state: State) {
				/* .at() and .with() */
				if (t.isIdentifier(path.node.property) && path.node.property.name === 'at') {
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: 'Prefer negative array subscripts over `.at()`',
						loc: loc(path.node.loc),
					});
				}
				if (t.isIdentifier(path.node.property) && path.node.property.name === 'with') {
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: 'Prefer negative array subscripts over `.with()`',
						loc: loc(path.node.loc),
					});
				}

				/* Date */
				if (t.isIdentifier(path.node.object) && path.node.object.name === 'Date') {
					state.file.ast.errors.push({
						type: 'Warning' /* temporary */,
						category: 'Semantic',
						message: '`Date` is a deprecated artifact. Use `Temporal` instead.',
						loc: loc(path.node.loc),
					});
				}

				/* document.all */
				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'document' &&
					t.isIdentifier(path.node.property) &&
					path.node.property.name === 'all'
				) {
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: '`document.all` is a deprecated artifact',
						loc: loc(path.node.loc),
					});
				}
			},
			Identifier(path: NodePath<Identifier>, state: State) {
				/* undefined */
				if (path.node.name === 'undefined' && !t.isGenericTypeAnnotation(path.parent)) {
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message:
							'`undefined` should not be used explicitly. For nullish initializations use `null` instead',
						loc: loc(path.node.loc),
					});
				}
			},
			UnaryExpression(path: NodePath<UnaryExpression>, state: State) {
				/* + number coercion */
				if (path.node.operator === '+' && t.isStringLiteral(path.node.argument)) {
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: 'Prefer `parseInt()` or `parseFloat()` over `+` implicit coercion',
						loc: loc(path.node.loc),
					});
				}

				/* -0 */
				if (
					path.node.operator === '-' &&
					t.isNumericLiteral(path.node.argument) &&
					path.node.argument.value === 0
				) {
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: "`-0` doesn't make sense. Use `0` instead",
						loc: loc(path.node.loc),
					});
				}
			},
			VariableDeclarator(path: NodePath<VariableDeclarator>, state: State) {
				/* variable declaration with ternaries */
				if (t.isConditionalExpression(path.node.init)) {
					state.file.ast.errors.push({
						type: 'Error',
						category: 'Semantic',
						message: 'Prefer `do` expressions over ternaries for variable declarations',
						loc: loc(path.node.loc),
					});
				}
			},
		},
	};
}
