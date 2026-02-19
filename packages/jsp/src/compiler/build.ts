import { readFileSync } from 'node:fs';

import chalk from 'chalk';
import { SourceMapConsumer } from 'source-map';

import { type CompleteConfig } from '../config/index.js';

import { compile, type Out } from './compile.js';
import { emitCode, emitSourceMap } from './emit.js';
import { getInputs } from './inputs.js';
import { emitPolyfills } from './polyfill.js';

export const build = async (config: CompleteConfig) => {
	const filenames = getInputs(config);

	let errors = 0;

	for (const filename of filenames) {
		const jspCode = readFileSync(filename, 'utf8');

		const out = compile(filename, jspCode, config);

		if (out.diagnostics.length > 0) {
			errors += out.diagnostics.length;

			await printDiagnostics(filename, jspCode, out);
		}

		if (out.code === null) {
			continue;
		}

		/* emit source maps */
		if (config.compiler.emitSourceMaps) {
			emitSourceMap(filename, out.sourceMap, config);
		}

		emitCode(filename, out.code, config);
	}

	emitPolyfills(config);

	if (errors === 0) {
		console.log(chalk.green('JS+ compiled successfully'));
	} else {
		console.log(chalk.red(`Found ${errors} error${errors > 1 ? 's' : ''}`));
	}
};

export const printDiagnostics = async (filename: string, jspCode: string, out: Out) => {
	const sourceMapper = out.sourceMap === null ? null : await new SourceMapConsumer(out.sourceMap);

	for (const error of out.diagnostics) {
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

		printDiagnostic(
			filename,
			error.type,
			error.category,
			error.message
				.replace('unknown: ', '')
				.replace(/ \(\d+:\d+\)/, '')
				.split('\n')[0]!,
			{
				/* natural language */
				startLine: range.startLine + 1,
				startCharacter: range.startCharacter + 1,
				length: range.length,
			},
			jspCode.split('\n')[range.startLine] ?? null,
		);
	}

	sourceMapper?.destroy();
};

const printDiagnostic = (
	filename: string,
	type: 'Warning' | 'Error',
	category: string,
	message: string,
	range: {
		startLine: number;
		startCharacter: number;
		length: number;
	},
	code: null | string,
) => {
	console.log(
		`${chalk.blue(filename)}:${chalk.yellow(range.startLine)}:${chalk.yellow(range.startCharacter)} • ${type === 'Error' ? chalk.red(category + type) : chalk.yellow(category + type)} • ${message}`,
	);
	if (code !== null) {
		console.log(`${chalk.bgWhite.black(range.startLine)} ${code}`);
		console.log(
			`${chalk.bgWhite(' '.repeat(range.startLine.toString().length))} ${' '.repeat(range.startCharacter - 1)}${chalk.red('~'.repeat(range.length))}`,
		);
	}
	console.log();
};
