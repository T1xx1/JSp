import { exit } from 'node:process';

import chalk from 'chalk';

import { assert } from '../../tslib/std/assert.js';

type Severity = 'info' | 'warn' | 'error';

const styleSeverity = ({ message, severity }: { message: string; severity: Severity }): string => {
	switch (severity) {
		case 'info': {
			return chalk.gray(message);
		}
		case 'warn': {
			return chalk.yellow(message);
		}
		case 'error': {
			return chalk.red(message);
		}
		default: {
			throw assert<never>(severity);
		}
	}
};

export const print = ({ message, severity }: { message: string; severity: Severity }) => {
	console.log(styleSeverity({ message, severity }));
};

export const printExit = ({ message, severity }: { message: string; severity: Severity }) => {
	print({ message, severity });

	exit(1);
};
