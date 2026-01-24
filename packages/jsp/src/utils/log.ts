import chalk from 'chalk';

export const log = {
	success: (message: string) => {
		console.log(chalk.green(message));
	},
	warn: (message: string) => {
		console.log(chalk.yellow(message));
	},
	error: (message: string, error: Error) => {
		console.log(chalk.red(message));

		console.error(error);
	},
	info: (message: string) => {
		console.log(chalk.gray(message));
	},
};
