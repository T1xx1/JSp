import { exit } from 'node:process';

import { transformSync, type BabelFileResult, type ParseResult } from '@babel/core';

import { type CompleteConfig } from '../config/index.js';
import { tryCatchSync } from '../polyfills/index.js';
import { panic } from '../utils/index.js';

export type ParseErrors = Exclude<ParseResult['errors'], null>;
export type TransformationResult = BabelFileResult & {
	syntaxError: false;
	ast: ParseResult & {
		errors: ParseErrors;
	};
	code: string;
};
export type SyntaxError = {
	syntaxError: true;
	ast: {
		errors: ParseErrors;
	};
};

export const transform = (
	jspCode: string,
	config: CompleteConfig,
): TransformationResult | SyntaxError => {
	const { data: ts, error: syntaxError } = tryCatchSync<
		null | TransformationResult,
		null | ParseErrors[number]
	>(() => {
		return transformSync(jspCode, {
			ast: true,
			parserOpts: {
				errorRecovery: true,
				sourceType: 'module',
				strictMode: true,
			},
			plugins: [
				/* parse TypeScript */
				'@babel/plugin-syntax-typescript',

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
		}) as TransformationResult;
	});

	if (syntaxError) {
		return {
			syntaxError: true,
			ast: {
				errors: [syntaxError],
			},
		};
	}

	if (!ts || !ts.ast || !ts.code) {
		panic('MKYHKYDERU', 'Null Babel transformation');
		exit();
	}

	ts.syntaxError = false;

	return ts;
};
