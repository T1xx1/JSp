import chalk from 'chalk';

export const log = {
	success: (message: string) => {
		console.log(chalk.green(message));
	},
	warn: (duid: string, message: string) => {
		console.log(chalk.yellow(`Warning (${duid}): ${message}`));
	},
	error: (duid: string, message: string, error?: Error) => {
		console.log(chalk.red(`Error (${duid}): ${message}`));

		if (error) {
			console.error(error);
		}
	},
	info: (message: string) => {
		console.log(chalk.gray(message));
	},
};
