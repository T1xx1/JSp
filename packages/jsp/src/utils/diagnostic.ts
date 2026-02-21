import { exit } from 'node:process';

import chalk from 'chalk';

export type DiagnosticType = 'Info' | 'Warning' | 'Error';
export type DiagnosticCategory = 'Syntax' | 'Semantic' | 'Runtime';

const colorDiagnostic = (type: DiagnosticType, data: string): string => {
	switch (type) {
		case 'Info': {
			return chalk.gray(data);
		}
		case 'Warning': {
			return chalk.yellow(data);
		}
		case 'Error': {
			return chalk.red(data);
		}
	}
};

export const printDiagnostic = (type: DiagnosticType, message: string): void => {
	console.log(`${colorDiagnostic(type, `${type}: ${message}`)}`);
	console.log();
};

export const printExitDiagnostic = (type: DiagnosticType, message: string): never => {
	printDiagnostic(type, message);

	exit(1);
};

export const printCodeDiagnostic = (
	filename: string,
	range: {
		startLine: number;
		startCharacter: number;
		length: number;
	},
	type: DiagnosticType,
	category: DiagnosticCategory,
	message: string,
	code: string,
): void => {
	console.log(
		`${chalk.blue(filename)}:${chalk.yellow(range.startLine)}:${range.startCharacter} • ${colorDiagnostic(type, category + type)} • ${message}`,
	);
	console.log(`${chalk.bgWhite.black(range.startLine)} ${code}`);
	console.log(
		`${chalk.bgWhite(' '.repeat(range.startLine.toString().length))} ${' '.repeat(range.startCharacter - 1)}${chalk.red('~'.repeat(range.length))}`,
	);
	console.log();
};
