import { types, type NodePath, type PluginPass } from '@babel/core';
import type { MemberExpression, Program } from '@babel/types';

type State = PluginPass & {
	polyfills: Set<string>;
};

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-transform-polyfills',
		visitor: {
			MemberExpression(path: NodePath<MemberExpression>, state: State) {
				if (!t.isIdentifier(path.node.object) || !t.isIdentifier(path.node.property)) {
					return;
				}

				if (path.node.object.name === 'Math' && path.node.property.name === 'clamp') {
					state.polyfills.add('_jsp/polyfill/math-clamp');
				}

				if (
					path.node.object.name === 'Object' &&
					['keysLength', 'getOwnPropertyNamesLength', 'getOwnPropertySymbolsLength'].includes(
						path.node.property.name,
					)
				) {
					state.polyfills.add('_jsp/polyfill/object-propertycount');
				}

				if (
					path.node.object.name === 'Promise' &&
					['allKeyed', 'allSettledKeyed'].includes(path.node.property.name)
				) {
					state.polyfills.add('_jsp/polyfill/promise-allkeyed');
				}

				if (path.node.object.name === 'Promise' && path.node.property.name === 'isPromise') {
					state.polyfills.add('_jsp/polyfill/promise-ispromise');
				}

				if (path.node.object.name === 'Random') {
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
