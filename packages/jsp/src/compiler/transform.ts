import { transformSync, type ParseResult } from '@babel/core';

import pluginSubset from '@jsplang/plugin-subset';
/* @ts-expect-error */
import pluginProposalAsyncDoExpressions from '@babel/plugin-proposal-async-do-expressions';
/* @ts-expect-error */
import pluginProposalDiscardBinding from '@babel/plugin-proposal-discard-binding';
/* @ts-expect-error */
import pluginProposalDoExpressions from '@babel/plugin-proposal-do-expressions';
/* @ts-expect-error */
import pluginProposalExportDefaultFrom from '@babel/plugin-proposal-export-default-from';
/* @ts-expect-error */
import pluginProposalDecorators from '@babel/plugin-proposal-decorators';
/* @ts-expect-error */
import pluginProposalPipelineOperator from '@babel/plugin-proposal-pipeline-operator';
/* @ts-expect-error */
import pluginProposalThrowExpressions from '@babel/plugin-proposal-throw-expressions';
/* @ts-expect-error */
import pluginSyntaxTypeScript from '@babel/plugin-syntax-typescript';
import pluginTransformChainedComparisons from '@jsplang/plugin-transform-chained-comparisons';
import pluginTransformNegativeArraySubscript from '@jsplang/plugin-transform-negative-array-subscript';
import pluginTransformTypeofNullOperator from '@jsplang/plugin-transform-typeof-null-operator';

import { type CompleteConfig } from '../config/index.js';
import { tryCatchSync } from '../polyfills/index.js';
import { panic } from '../utils/index.js';

export type SourceMap = {
	version: number;
	file: string;
	names: string[];
	sourceRoot: string;
	sources: string[];
	sourcesContent: string[];
	mappings: string;
	ignoreList: string[];
};
export type BabelResult = {
	map: SourceMap;
	ast: ParseResult & {
		errors: Exclude<ParseResult['errors'], null>;
	};
	code: string;
};
export type BabelSyntaxError = {
	code: 'BABEL_PARSE_ERROR';
	reasonCode: 'UnexpectedToken';
	message: string;
	loc: {
		line: number;
		column: number;
	};
};

export type Transformation =
	| {
			map: null;
			ast: {
				errors: BabelSyntaxError[];
			};
			code: null;
	  }
	| BabelResult;

export const transform = (
	filename: string,
	jspCode: string,
	config: CompleteConfig,
): Transformation => {
	const { data: ts, error: syntaxError } = tryCatchSync<BabelResult, BabelSyntaxError>(() => {
		return transformSync(jspCode, {
			filename,
			parserOpts: {
				errorRecovery: true,
				sourceType: 'module',
			},
			/* ast */
			ast: true,
			/* source maps */
			sourceMaps: true,
			/* code gen */
			compact: false,
			retainLines: true,
			/* plugins */
			plugins: [
				/* parse TypeScript */
				pluginSyntaxTypeScript,

				/* transform custom syntax */
				pluginTransformChainedComparisons,
				pluginTransformNegativeArraySubscript,
				pluginTransformTypeofNullOperator,

				/* subset */
				pluginSubset,

				/* transform TC39 proposals sorted by scope */
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
				[
					pluginProposalDecorators,
					{
						version: '2023-11',
					},
				],
				pluginProposalExportDefaultFrom,
			],
		}) as unknown as BabelResult;
	});

	if (syntaxError) {
		/* @ts-expect-error */
		if (syntaxError.category === 'Syntax') {
			return {
				map: null,
				ast: {
					errors: [syntaxError],
				},
				code: null,
			};
		}

		if (syntaxError.code === 'BABEL_PARSE_ERROR' && syntaxError.reasonCode === 'UnexpectedToken') {
			return {
				map: null,
				ast: {
					errors: [syntaxError],
				},
				code: null,
			};
		}

		throw panic('ML42CWWWLS', syntaxError.message);
	}

	if (!ts || !ts.ast || !ts.map || ts.code === null) {
		throw panic('MKYHKYDERU', 'Null Babel transformation');
	}

	return {
		map: ts.map,
		ast: ts.ast,
		code: ts.code,
	};
};
