import { types, type NodePath, type PluginPass } from '@babel/core';
import type { MemberExpression, Program } from '@babel/types';

type State = PluginPass & {
	polyfills: Set<string>;
};

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-template',
		visitor: {
			MemberExpression(path: NodePath<MemberExpression>, state: State) {
				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'Math' &&
					t.isIdentifier(path.node.property) &&
					path.node.property.name === 'clamp'
				) {
					state.polyfills.add('_jsp/polyfill/math-clamp');
				}

				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'Object' &&
					t.isIdentifier(path.node.property) &&
					['keysLength', 'getOwnPropertyNamesLength', 'getOwnPropertySymbolsLength'].includes(
						path.node.property.name,
					)
				) {
					state.polyfills.add('_jsp/polyfill/object-propertycount');
				}

				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'Promise' &&
					t.isIdentifier(path.node.property) &&
					(path.node.property.name === 'allKeyed' || path.node.property.name === 'allSettledKeyed')
				) {
					state.polyfills.add('_jsp/polyfill/promise-allkeyed');
				}

				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'Promise' &&
					t.isIdentifier(path.node.property) &&
					path.node.property.name === 'isPromise'
				) {
					state.polyfills.add('_jsp/polyfill/promise-ispromise');
				}

				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === 'Random' &&
					t.isIdentifier(path.node.property)
				) {
					state.polyfills.add('_jsp/polyfill/random');
				}
			},
			Program: {
				enter(path: NodePath<Program>, state: State) {
					state['polyfills'] = new Set();
				},
				exit(path: NodePath<Program>, state: State) {
					for (const polyfill of state['polyfills']) {
						path.unshiftContainer('body', t.importDeclaration([], t.stringLiteral(polyfill)));
					}
				},
			},
		},
	};
}
