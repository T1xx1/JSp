import { readFileSync } from 'node:fs';

import chalk from 'chalk';

import { getCompleteConfig } from '../config/index.js';

import { compile } from './compile.js';
import { emit } from './emit.js';
import { getInputs } from './inputs.js';
import { type Diagnostic } from './parse.js';

export const build = () => {
	const config = getCompleteConfig();

	const filenames = getInputs(config);

	let errors = 0;

	for (const filename of filenames) {
		const jspCode = readFileSync(filename, 'utf8');

		if (jspCode === null) {
			continue;
		}

		const out = compile(filename, jspCode, config);

		if (out.diagnostics.length > 0) {
			errors += out.diagnostics.length;

			for (const error of out.diagnostics) {
				printDiagnostic(filename, jspCode, error);
			}
		}

		if (out.code === null) {
			continue;
		}

		emit(filename, out.code, config);
	}

	if (errors === 0) {
		console.log(chalk.green('JS+ compiled successfully'));
	} else {
		console.log(chalk.red(`Found ${errors} error${errors > 1 ? 's' : ''}`));
	}
};

const printDiagnostic = (filename: string, jspCode: string, diagnostic: Diagnostic) => {
	const line = jspCode.split('\n')[diagnostic.loc.startLine]!;

	const range = {
		startLine: diagnostic.loc.startLine + 1,
		startCharacter: diagnostic.loc.startCharacter + 1,
		length: diagnostic.loc.endCharacter - diagnostic.loc.startCharacter,
	};

	console.log(
		`${chalk.red(`${diagnostic.type}:`)} ${chalk.blue(filename)}:${chalk.yellow(range.startLine)}:${chalk.yellow(range.startCharacter)} • ${
			diagnostic.message
				.replace('unknown: ', '')
				.replace(/ \(\d+:\d+\)/, '')
				.split('\n')[0]
		}`,
	);
	console.log(`${chalk.bgWhite(range.startLine)} ${line}`);
	console.log(
		`${chalk.bgWhite(' '.repeat(range.startLine.toString().length))} ${' '.repeat(range.startCharacter - 1)}${chalk.red('~'.repeat(range.length))}`,
	);
	console.log();
};
