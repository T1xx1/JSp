import { parse } from 'node:path';

import type { ParseResult } from '@babel/core';

import {
	convertSrcToEmitFilename,
	join,
	type CompleteConfig,
	type Diagnostic as JspDiagnostic,
	type Loc as JspLoc,
	type SyntaxError as JspSyntaxError,
} from './_.js';

export namespace Babel {
	export type Loc = {
		line?: number;
		column?: number;
	};

	export type SyntaxError = {
		code?: 'BABEL_PARSE_ERROR';
		reasonCode?: 'UnexpectedToken';
		message: string;
		loc?: Loc;
	};

	export type IntegratedJspSyntaxError = {
		jspDiagnostic: true;
	} & JspSyntaxError;
	export type IntegratedJspDiagnostic = {
		jspDiagnostic: true;
	} & JspDiagnostic;

	export type Result = {
		map: SourceMap;
		ast: ParseResult & {
			errors: Exclude<ParseResult['errors'], null>;
		};
		code: string;
	};

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

	export const convertLoc = (babelLoc?: Loc): JspLoc => {
		return {
			startLine: babelLoc?.line ?? 0 - 1,
			startCharacter: babelLoc?.column ?? 0,
			endLine: babelLoc?.line ?? 0 - 1,
			endCharacter: babelLoc?.column ?? 0 + 1,
		};
	};

	export const convertSourceMap = (
		filename: string,
		babelSourceMap: Babel.SourceMap,
		config: CompleteConfig,
	): SourceMap => {
		return {
			version: babelSourceMap.version,
			file: convertSrcToEmitFilename(parse(filename).base, config),
			sourceRoot: '',
			sources: [join('..', filename)],
			sourcesContent: [],
			names: [],
			mappings: babelSourceMap.mappings,
			ignoreList: [],
		};
	};

	export const throwIntegratedJspSyntaxError = (
		message: string,
		loc: JspLoc,
	): IntegratedJspSyntaxError => {
		return {
			jspDiagnostic: true,
			type: 'Error',
			category: 'Syntax',
			message,
			loc,
		};
	};
	export const createIntegratedJspDiagnostic = (
		jspDiagnostic: JspDiagnostic,
	): IntegratedJspDiagnostic => {
		return {
			jspDiagnostic: true,
			...jspDiagnostic,
		};
	};
}
