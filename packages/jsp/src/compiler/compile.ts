import { join, relative } from 'node:path';

import { transformSync, type ParseResult, type NodePath } from '@babel/core';
/* @ts-expect-error */
import pluginProposalAsyncDoExpressions from '@babel/plugin-proposal-async-do-expressions';
/* @ts-expect-error */
import pluginProposalDecorators from '@babel/plugin-proposal-decorators';
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
import { type Program } from '@babel/types';
import pluginLinterProposals from '@jsplang/plugin-lint-proposals';
import pluginLinterSubset from '@jsplang/plugin-lint-subset';
import pluginTransformChainedComparisons from '@jsplang/plugin-transform-chained-comparisons';
import pluginTransformNegativeArraySubscript from '@jsplang/plugin-transform-negative-array-subscript';
import pluginTransformTypeofNullOperator from '@jsplang/plugin-transform-typeof-null-operator';
import polyfillIteratorChunkingLint from '@jsplang/polyfill-iterator-chunking/lint';
import polyfillMathClampLint from '@jsplang/polyfill-math-clamp/lint';
import polyfillObjectPropertyCountLint from '@jsplang/polyfill-object-propertycount/lint';
import polyfillPromiseAllKeyedLint from '@jsplang/polyfill-promise-allkeyed/lint';
import polyfillPromiseIsPromiseLint from '@jsplang/polyfill-promise-ispromise/lint';
import polyfillRandomNamespaceLint from '@jsplang/polyfill-random-namespace/lint';
import { transpile } from 'typescript';

import { tsconfig, type CompleteConfig } from '../config/index.js';
import { panic, tryCatchSync } from '../utils/index.js';

import { parseTs, type Diagnostic } from './parse.js';

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
	code?: 'BABEL_PARSE_ERROR';
	reasonCode?: 'UnexpectedToken';
	message: string;
	loc?: {
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

export type Out =
	| {
			sourceMap: null;
			diagnostics: Diagnostic[];
			code: null;
	  }
	| {
			sourceMap: SourceMap;
			diagnostics: Diagnostic[];
			code: string;
	  };

export const compile = (filename: string, jspCode: string, config: CompleteConfig): Out => {
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

				/* subset linting */
				pluginLinterSubset,

				/* proposals linting */
				pluginLinterProposals,

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

				/* polyfills linting */
				polyfillIteratorChunkingLint,
				polyfillMathClampLint,
				polyfillObjectPropertyCountLint,
				polyfillPromiseAllKeyedLint,
				polyfillPromiseIsPromiseLint,
				polyfillRandomNamespaceLint,

				/* polyfills */
				function ({ types: t }) {
					return {
						visitor: {
							Program: {
								exit(path: NodePath<Program>) {
									const jspDir = './_jsp/index';
									const relativeDir = '../'.repeat(
										relative(config.rootDir, filename).split('\\').length - 1,
									);

									path.unshiftContainer(
										'body',
										t.importDeclaration([], t.stringLiteral(join(relativeDir, jspDir))),
									);
								},
							},
						},
					};
				},
			],
		}) as unknown as BabelResult;
	});

	if (syntaxError) {
		/* @ts-expect-error */
		if (syntaxError.jspDiagnostic) {
			return {
				sourceMap: null,
				diagnostics: [
					{
						type: 'Error',
						category: 'Syntax',
						message: syntaxError.message,
						/* @ts-expect-error */
						loc: syntaxError.loc,
					},
				],
				code: null,
			};
		}

		return {
			sourceMap: null,
			diagnostics: [
				{
					type: 'Error',
					category: 'Syntax',
					message: syntaxError.message,
					loc: {
						/* line index start at 1 */
						startLine: syntaxError.loc?.line ?? 1 - 1,
						startCharacter: syntaxError.loc?.column ?? 0,
						endLine: syntaxError.loc?.line ?? 1 - 1,
						/* 1 length error */
						endCharacter: syntaxError.loc?.column ?? 0 + 1,
					},
				},
			],
			code: null,
		};
	}

	if (!ts || !ts.ast || !ts.map || ts.code === null) {
		throw panic('MKYHKYDERU', 'Null Babel transformation');
	}

	const babelDiagnostics = ts.ast.errors
		.filter((error) => {
			const ignoreReasonCodes = ['DeclarationMissingInitializer'];

			return !ignoreReasonCodes.includes(error.reasonCode);
		})
		.map((error) => {
			return {
				/* @ts-expect-error */
				type: error.type ?? ('Error' as const),
				/* @ts-expect-error */
				category: error.category ?? ('Semantic' as const),
				message: error.message,
				loc: {
					/* index starts at 1 */
					startLine: error.loc.line - 1,
					startCharacter: error.loc.column,
					endLine: error.loc.line - 1,
					/* 1 length error */
					endCharacter: error.loc.column + 1,
				},
			};
		});
	const tsDiagnostics = parseTs(filename, ts.code);

	const code =
		config.compiler.emitLang === 'TypeScript'
			? ts.code
			: transpile(ts.code, tsconfig.compilerOptions);

	return {
		sourceMap: ts.map,
		diagnostics: [...babelDiagnostics, ...tsDiagnostics],
		code,
	};
};
