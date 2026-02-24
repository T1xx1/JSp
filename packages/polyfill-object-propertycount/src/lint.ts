import { types, type NodePath, type PluginPass } from '@babel/core';
import type { MemberExpression } from '@babel/types';

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/polyfill-object-propertycount-lint',
		visitor: {
			MemberExpression(path: NodePath<MemberExpression>, state: PluginPass) {
				if (
					t.isIdentifier(path.node.property) &&
					path.node.property.name === 'length' &&
					t.isCallExpression(path.node.object) &&
					t.isMemberExpression(path.node.object.callee) &&
					t.isIdentifier(path.node.object.callee.object) &&
					path.node.object.callee.object.name === 'Object' &&
					t.isIdentifier(path.node.object.callee.property) &&
					['keys', 'getOwnPropertyNames', 'getOwnPropertySymbols'].includes(
						path.node.object.callee.property.name,
					)
				) {
					if (path.node.object.callee.property.name === 'keys') {
						/* @ts-expect-error */
						state.file.ast.errors.push({
							type: 'Error',
							category: 'Semantic',
							message: 'Prefer `Object.keysLength()` over `Object.keys().length`',
							loc: {
								line: path.node.loc?.start.line!,
								column: path.node.loc?.start.column!,
							},
						});
					}

					if (path.node.object.callee.property.name === 'getOwnPropertyNames') {
						/* @ts-expect-error */
						state.file.ast.errors.push({
							type: 'Error',
							category: 'Semantic',
							message:
								'Prefer `Object.getOwnPropertyNamesLength()` over `Object.getOwnPropertyNames().length`',
							loc: {
								line: path.node.loc?.start.line!,
								column: path.node.loc?.start.column!,
							},
						});
					}

					if (path.node.object.callee.property.name === 'getOwnPropertySymbols') {
						/* @ts-expect-error */
						state.file.ast.errors.push({
							type: 'Error',
							category: 'Semantic',
							message:
								'Prefer `Object.getOwnPropertySymbolsLength()` over `Object.getOwnPropertySymbols().length`',
							loc: {
								line: path.node.loc?.start.line!,
								column: path.node.loc?.start.column!,
							},
						});
					}
				}
			},
		},
	};
}
