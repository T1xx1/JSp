import { exit } from 'node:process';

import chalk from 'chalk';

export const log = {
	success: (message: string) => {
		console.log(chalk.green(message));
	},
	error: (message: string, error?: Error) => {
		console.log(chalk.red(message));

		console.error(error);
	},
	exit: (message: string, error?: Error): never => {
		log.error(message, error);

		exit();
	},
};
