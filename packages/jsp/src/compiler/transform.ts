import { exit } from 'node:process';

import { transformSync, type BabelFileResult } from '@babel/core';

import type { CompleteConfig } from '../config/index.js';
import { panic } from '../utils/index.js';

export const transform = (
	jspCode: string,
	config: CompleteConfig,
): BabelFileResult & {
	code: string;
} => {
	const out = transformSync(jspCode, {
		ast: true,
		plugins: [
			/* parse/transform TypeScript */
			config.compiler.emitLang === 'TypeScript'
				? '@babel/plugin-syntax-typescript'
				: '@babel/plugin-transform-typescript',

			/* transform custom syntax */
			'module:@jsp/plugin-transform-typeof-null-operator',
			'module:@jsp/plugin-transform-negative-array-subscript',
			'module:@jsp/plugin-transform-chained-comparisons',

			/* transform TC39 sorted by scope */
			'@babel/plugin-proposal-throw-expressions',
			'@babel/plugin-proposal-do-expressions',
			'@babel/plugin-proposal-async-do-expressions',
			[
				'@babel/plugin-proposal-discard-binding',
				{
					syntaxType: 'void',
				},
			],
			[
				'@babel/plugin-proposal-pipeline-operator',
				{
					proposal: 'hack',
					topicToken: '%',
				},
			],
			'@babel/plugin-proposal-export-default-from',
		],
	});

	if (!out || !out.ast || !out.code) {
		panic('MKYHKYDERU', 'Null Babel transformation');

		exit();
	}

	/* @ts-expect-error */
	return out;
};
