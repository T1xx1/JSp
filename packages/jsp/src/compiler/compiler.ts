import { transformSync } from '@babel/core';
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
import pluginTransformChainedComparisons from '@jsplang/plugin-transform-chained-comparisons';
import pluginTransformNegativeArraySubscript from '@jsplang/plugin-transform-negative-array-subscript';
import pluginTransformTypeofNullOperator from '@jsplang/plugin-transform-typeof-null-operator';
import polyfillIteratorChunkingLint from '@jsplang/polyfill-iterator-chunking/lint';
import polyfillMathClampLint from '@jsplang/polyfill-math-clamp/lint';
import polyfillObjectPropertyCountLint from '@jsplang/polyfill-object-propertycount/lint';
import polyfillPromiseAllKeyedLint from '@jsplang/polyfill-promise-allkeyed/lint';
import polyfillPromiseIsPromiseLint from '@jsplang/polyfill-promise-ispromise/lint';
import polyfillRandomNamespaceLint from '@jsplang/polyfill-random-namespace/lint';

import {
	Babel,
	Ts,
	panic,
	lintProposalsVisitor,
	lintSubsetVisitor,
	transformInternalVisitor,
	tryCatchSync,
	type CompleteConfig,
	type Diagnostic,
	type SourceMap,
	type SyntaxError,
} from './_.js';

/* prettier-ignore */
export type OutTs = {
	sourceMap: null;
	diagnostics: SyntaxError[];
	code: null;
} | {
	sourceMap: SourceMap;
	diagnostics: Diagnostic[];
	code: string;
};

/**
 * Compile JS+ code to TypeScript code
 */
export const compile = (filename: string, jspCode: string, config: CompleteConfig): OutTs => {
	const { data: ts, error: syntaxError } = tryCatchSync<Babel.Result, Babel.SyntaxError>(() => {
		return transformSync(jspCode, {
			filename,
			parserOpts: {
				errorRecovery: true,
				sourceType: 'module',
			},
			/* source maps */
			sourceMaps: true,
			/* ast */
			ast: true,
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
				lintSubsetVisitor,

				/* proposals linting */
				lintProposalsVisitor,

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

				/* internal */
				function ({ types: t }) {
					return transformInternalVisitor(filename, config, t);
				},
			],
		}) as unknown as Babel.Result;
	});

	if (syntaxError) {
		/* @ts-expect-error */
		if (syntaxError.jspDiagnostic) {
			const se = syntaxError as unknown as Babel.IntegratedJspSyntaxError;

			/* @ts-expect-error */
			delete se.jspDiagnostic;

			return {
				sourceMap: null,
				diagnostics: [se],
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
					loc: Babel.convertLoc(syntaxError.loc),
				},
			],
			code: null,
		};
	}

	if (!ts || !ts.ast || !ts.map || ts.code === null) {
		throw panic('MKYHKYDERU', 'Null Babel transformation');
	}

	const babelDiagnostics = ts.ast.errors
		.filter((diagnostic) => {
			const ignoreReasonCodes = ['DeclarationMissingInitializer'];

			return !ignoreReasonCodes.includes(diagnostic.reasonCode);
		})
		.map((diagnostic) => {
			/* @ts-expect-error */
			if (diagnostic.jspDiagnostic) {
				const d = diagnostic as unknown as Babel.IntegratedJspDiagnostic;

				/* @ts-expect-error */
				delete d.jspDiagnostic;

				return d;
			}

			return {
				type: 'Error' as const,
				category: 'Semantic' as const,
				message: diagnostic.message,
				loc: Babel.convertLoc(diagnostic.loc),
			};
		});
	const tsDiagnostics = Ts.parseCode(filename, ts.code);

	return {
		sourceMap: Babel.convertSourceMap(filename, ts.map, config),
		diagnostics: [...babelDiagnostics, ...tsDiagnostics],
		code: ts.code,
	};
};
