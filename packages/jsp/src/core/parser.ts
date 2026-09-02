import { tsPlugin } from '@sveltejs/acorn-typescript';
import { Parser, type Options } from 'acorn';

import type { File } from './utils/fs.js';
import { plugins } from '../plugins/_index.js';

const parser = Parser.extend(
	tsPlugin(),
	...plugins.map((plugin) => {
		return plugin.parser;
	}),
);
const parserOptions: Options = {
	ecmaVersion: 'latest',
	sourceType: 'module',
	allowImportExportEverywhere: true,
};

export const parse = ({ file }: { file: File }) => {
	return parser.parse(file.content, parserOptions);
};
