import { transformSync, type BabelFileResult, type ParseResult } from '@babel/core';

/* @ts-expect-error */
import pluginProposalAsyncDoExpressions from '@babel/plugin-proposal-async-do-expressions';
/* @ts-expect-error */
import pluginProposalDiscardBinding from '@babel/plugin-proposal-discard-binding';
/* @ts-expect-error */
import pluginProposalDoExpressions from '@babel/plugin-proposal-do-expressions';
/* @ts-expect-error */
import pluginProposalExportDefaultFrom from '@babel/plugin-proposal-export-default-from';
/* @ts-expect-error */
import pluginProposalPipelineOperator from '@babel/plugin-proposal-pipeline-operator';
/* @ts-expect-error */
import pluginProposalThrowExpressions from '@babel/plugin-proposal-throw-expressions';
/* @ts-expect-error */
import pluginSyntaxTypeScript from '@babel/plugin-syntax-typescript';
import pluginTransformChainedComparisons from '@jsp/plugin-transform-chained-comparisons';
import pluginTransformNegativeArraySubscript from '@jsp/plugin-transform-negative-array-subscript';
import pluginTransformTypeofNullOperator from '@jsp/plugin-transform-typeof-null-operator';

import { type CompleteConfig } from '../config/index.js';
import { tryCatchSync } from '../polyfills/index.js';
import { panic } from '../utils/index.js';

type P = Exclude<ParseResult['errors'], null>[number];

export type ParseError = P & {
	code: P['code'] & 'BABEL_PARSE_ERROR';
};

export type TransformationResult = BabelFileResult & {
	syntaxError: false;
	ast: ParseResult & {
		errors: ParseError[];
	};
	code: string;
};
export type SyntaxError = {
	syntaxError: true;
	ast: {
		errors: ParseError[];
	};
};

export const transform = (
	jspCode: string,
	config: CompleteConfig,
): TransformationResult | SyntaxError => {
	const { data: ts, error: panicError } = tryCatchSync<
		null | TransformationResult,
		null | ParseError
	>(() => {
		return transformSync(jspCode, {
			ast: true,
			parserOpts: {
				errorRecovery: true,
				sourceType: 'module',
				strictMode: true,
			},
			compact: false,
			retainLines: true,
			plugins: [
				/* parse TypeScript */
				pluginSyntaxTypeScript,

				/* transform custom syntax */
				pluginTransformChainedComparisons,
				pluginTransformNegativeArraySubscript,
				pluginTransformTypeofNullOperator,

				/* transform TC39 sorted by scope */
				pluginProposalThrowExpressions,
				pluginProposalDoExpressions,
				pluginProposalAsyncDoExpressions,
				[
					pluginProposalDiscardBinding,
					{
						syntaxType: 'void',
					},
				],
				[
					pluginProposalPipelineOperator,
					{
						proposal: 'hack',
						topicToken: '%',
					},
				],
				pluginProposalExportDefaultFrom,
			],
		}) as TransformationResult;
	});

	if (panicError) {
		if (panicError.code === 'BABEL_PARSE_ERROR' && panicError.reasonCode === 'UnexpectedToken') {
			return {
				syntaxError: true,
				ast: {
					errors: [panicError],
				},
			};
		}

		throw panic('ML42CWWWLS', panicError.message);
	}

	if (!ts || !ts.ast || !ts.code) {
		throw panic('MKYHKYDERU', 'Null Babel transformation');
	}

	ts.syntaxError = false;

	return ts;
};
