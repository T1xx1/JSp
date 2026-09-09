import { tsPlugin } from '@sveltejs/acorn-typescript';
import { TSESTree } from '@typescript-eslint/types';
import { Parser, type Options } from 'acorn';

import { plugins } from '../plugins/_index.js';

const P = Parser.extend(
	tsPlugin(),
	...plugins.map((plugin) => {
		return plugin.parser;
	}),
);

const parserOptions: Options = {
	locations: true,
	/*  */
	sourceType: 'module',
	ecmaVersion: 'latest',
	allowImportExportEverywhere: true,
};

export const parse = (fileContent: string): TSESTree.Program => {
	return P.parse(fileContent, parserOptions);
};
