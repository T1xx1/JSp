import { types, type NodePath, type PluginPass } from '@babel/core';
import type { MemberExpression, Program } from '@babel/types';

type State = PluginPass & {
	polyfills: Set<string>;
};

export default function ({ types: t }: { types: typeof types }) {
	return {
		name: '@jsplang/plugin-template',
		visitor: {
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
