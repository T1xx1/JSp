import { readFileSync } from 'node:fs';

import chalk from 'chalk';
import { SourceMapConsumer } from 'source-map';

import { type CompleteConfig } from '../config/index.js';

import { compile, type Out } from './compile.js';
import { emitCode, emitSourceMap } from './emit.js';
import { getInputs } from './inputs.js';

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

	if (errors === 0) {
		console.log(chalk.green('JS+ compiled successfully'));
	} else {
		console.log(chalk.red(`Found ${errors} error${errors > 1 ? 's' : ''}`));
	}
};

export const printDiagnostics = async (filename: string, jspCode: string, out: Out) => {
	const sourceMapper = out.sourceMap === null ? null : await new SourceMapConsumer(out.sourceMap);

	for (const error of out.diagnostics) {
		const loc =
			sourceMapper === null
				? null
				: sourceMapper.originalPositionFor({
						/* line index starts at 1 */
						line: error.loc.startLine + 1,
						column: error.loc.startCharacter,
					});
		/* only line index starts at 1 */
		if (loc && loc.line) {
			loc.line -= 1;
		}

		if (loc !== null && (loc.source === null || loc.line === null || loc.column === null)) {
			continue;
		}

		const range = {
			startLine: loc?.line ?? error.loc.startLine,
			startCharacter: loc?.column ?? error.loc.startCharacter,
			length: error.loc.endCharacter - error.loc.startCharacter,
		};

		const line = jspCode.split('\n')[range.startLine]!;

		printDiagnostic(
			filename,
			error.type,
			error.category,
			error.message
				.replace('unknown: ', '')
				.replace(/ \(\d+:\d+\)/, '')
				.split('\n')[0]!,
			line,
			{
				/* natural language */
				startLine: range.startLine + 1,
				startCharacter: range.startCharacter + 1,
				length: range.length,
			},
		);
	}

	sourceMapper?.destroy();
};

const printDiagnostic = (
	filename: string,
	type: 'Warning' | 'Error',
	category: string,
	message: string,
	code: string,
	range: {
		startLine: number;
		startCharacter: number;
		length: number;
	},
) => {
	console.log(
		`${chalk.blue(filename)}:${chalk.yellow(range.startLine)}:${chalk.yellow(range.startCharacter)} • ${type === 'Error' ? chalk.red(category + type) : chalk.yellow(category + type)} • ${message}`,
	);
	console.log(`${chalk.bgWhite.black(range.startLine)} ${code}`);
	console.log(
		`${chalk.bgWhite(' '.repeat(range.startLine.toString().length))} ${' '.repeat(range.startCharacter - 1)}${chalk.red('~'.repeat(range.length))}`,
	);
	console.log();
};
