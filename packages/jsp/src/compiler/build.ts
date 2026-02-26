import { readFileSync } from 'node:fs';

import chalk from 'chalk';
import { SourceMapConsumer } from 'source-map';

import { type Config } from '../config/index.js';
import { printCodeDiagnostic } from '../utils/diagnostic.js';

import { compile, type OutTs } from './compile.js';
import { emitCode, emitSourceMap } from './emit.js';
import { getInputs } from './inputs.js';
import { emitPolyfills } from './polyfill.js';

export const build = async (config: Config) => {
	const filenames = getInputs(config);

	let errors = 0;

	for (const filename of filenames) {
		const jspCode = readFileSync(filename, 'utf8');

		const outTs = compile(filename, jspCode, config);

		if (outTs.diagnostics.length > 0) {
			errors += outTs.diagnostics.length;

			await printCodeDiagnostics(filename, jspCode, outTs);
		}

		if (outTs.code === null) {
			continue;
		}

		if (config.compiler.emitCode) {
			emitCode(filename, outTs.code, config);
		}
		if (config.compiler.emitSourceMaps) {
			emitSourceMap(filename, outTs.sourceMap, config);
		}
	}

	emitPolyfills(config);

	if (errors === 0) {
		console.log(chalk.green('JS+ compiled successfully'));
	} else {
		console.log(chalk.red(`Found ${errors} error${errors > 1 ? 's' : ''}`));
	}
};

export const printCodeDiagnostics = async (filename: string, jspCode: string, outTs: OutTs) => {
	const sourceMapper =
		outTs.sourceMap === null ? null : await new SourceMapConsumer(outTs.sourceMap);

	for (const error of outTs.diagnostics) {
		const startLoc =
			sourceMapper === null
				? null
				: sourceMapper.originalPositionFor({
						/* line index starts at 1 */
						line: error.loc.startLine + 1,
						column: error.loc.startCharacter,
					});
		const endLoc =
			sourceMapper === null
				? null
				: sourceMapper.originalPositionFor({
						/* line index starts at 1 */
						line: error.loc.endLine + 1,
						column: error.loc.endCharacter,
					});

		/* line index starts at 1 */
		if (startLoc?.line) {
			startLoc.line -= 1;
		}
		if (endLoc?.line) {
			endLoc.line -= 1;
		}

		const range = {
			startLine: startLoc?.line ?? error.loc.startLine,
			startCharacter: startLoc?.column ?? error.loc.startCharacter,
			length:
				(endLoc?.column ?? error.loc.endCharacter) - (startLoc?.column ?? error.loc.startCharacter),
		};

		printCodeDiagnostic(
			filename,
			{
				/* index starts at 0 */
				startLine: range.startLine + 1,
				startCharacter: range.startCharacter + 1,
				length: range.length,
			},
			error.type,
			error.category,
			error.message
				.replace('unknown: ', '')
				.replace(/ \(\d+:\d+\)/, '')
				.split('\n')[0]!,
			jspCode.split('\n')[range.startLine]!,
		);
	}

	sourceMapper?.destroy();
};
