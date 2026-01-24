import { transformSync } from '@babel/core';

import type { CompleteConfig } from '../config/index.js';

export const compile = (jspCode: string, config: CompleteConfig): string => {
	if (jspCode === '') {
		return '';
	}

	const jsCode = transformSync(jspCode, {
		plugins: [
			/* parse TypeScript */
			config.compiler.emitLang === 'TypeScript'
				? '@babel/plugin-syntax-typescript'
				: '@babel/plugin-transform-typescript',

			/* transform custom syntax */
			'module:@jsp/plugin-typeof-null-operator',
			'module:@jsp/plugin-negative-array-subscript',
			'module:@jsp/plugin-chained-comparisons',

			/* sorted by scope */
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

	if (!jsCode || !jsCode.code) {
		throw new Error('JS+ error: null babel transformation');
	}

	return jsCode.code;
};
