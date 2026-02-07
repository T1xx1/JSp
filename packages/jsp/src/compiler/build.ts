import { readFileSync } from 'node:fs';

import chalk from 'chalk';
import { SourceMapConsumer } from 'source-map';

import { getCompleteConfig } from '../config/index.js';
import { panic } from '../utils/index.js';

import { compile, type Out } from './compile.js';
import { emitCode, emitSourceMap } from './emit.js';
import { getInputs } from './inputs.js';
import { type Diagnostic } from './parse.js';

export const build = async () => {
	const config = getCompleteConfig();

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
		const pos =
			sourceMapper === null
				? {
						line: error.loc.startLine,
						column: error.loc.startCharacter,
					}
				: sourceMapper.originalPositionFor({
						line: error.loc.startLine + 1,
						column: error.loc.startCharacter,
					});

		if (pos.line === null || pos.column === null) {
			throw panic('MLCA7TCMXX', 'Null source map positions');
		}

		const line = jspCode.split('\n')[error.loc.startLine]!;

		printDiagnostic(filename, line, error, {
			startLine: pos.line,
			startCharacter: pos.column + 1,
			length: error.loc.endCharacter - error.loc.startCharacter,
		});
	}

	sourceMapper?.destroy();
};

const printDiagnostic = (
	filename: string,
	code: string,
	diagnostic: Diagnostic,
	range: {
		startLine: number;
		startCharacter: number;
		length: number;
	},
) => {
	console.log(
		`${chalk.red(`${diagnostic.type}:`)} ${chalk.blue(filename)}:${chalk.yellow(range.startLine)}:${chalk.yellow(range.startCharacter)} • ${
			diagnostic.message
				.replace('unknown: ', '')
				.replace(/ \(\d+:\d+\)/, '')
				.split('\n')[0]
		}`,
	);
	console.log(`${chalk.bgWhite(range.startLine)} ${code}`);
	console.log(
		`${chalk.bgWhite(' '.repeat(range.startLine.toString().length))} ${' '.repeat(range.startCharacter - 1)}${chalk.red('~'.repeat(range.length))}`,
	);
	console.log();
};
