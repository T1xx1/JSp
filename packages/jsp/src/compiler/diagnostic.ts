import { exit } from 'node:process';

import chalk from 'chalk';

export type DiagnosticCategory = 'Info' | 'Warning' | 'Error';
export type DiagnosticType = 'Semantic';

export type Loc = {
	startLine: number;
	startCharacter: number;
	endLine: number;
	endCharacter: number;
};

export type SyntaxError = {
	type: 'Error';
	category: 'Syntax';
	message: string;
	loc: Loc;
};
export type Diagnostic = {
	type: DiagnosticCategory;
	category: DiagnosticType;
	message: string;
	loc: Loc;
};

const colorDiagnosticType = (type: DiagnosticCategory, data: string): string => {
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

export const printDiagnostic = (type: DiagnosticCategory, message: string): void => {
	console.log(`${colorDiagnosticType(type, `${type}: ${message}`)}`);
	console.log();
};

export const printExitDiagnostic = (type: DiagnosticCategory, message: string): never => {
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
	type: DiagnosticCategory,
	category: 'Syntax' | DiagnosticType,
	message: string,
	code: string,
): void => {
	console.log(
		`${chalk.blue(filename)}:${chalk.yellow(range.startLine)}:${chalk.yellow(range.startCharacter)} • ${colorDiagnosticType(type, category + type)} • ${message}`,
	);
	console.log(`${chalk.bgWhite.black(range.startLine)} ${code}`);
	console.log(
		`${chalk.bgWhite(' '.repeat(range.startLine.toString().length))} ${' '.repeat(range.startCharacter - 1)}${chalk.red('~'.repeat(range.length))}`,
	);
	console.log();
};
