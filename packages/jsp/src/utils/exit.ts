import { exit as nodeExit } from 'node:process';

import chalk from 'chalk';

export const exit = (message: string): never => {
	console.log(chalk.red(message));

	nodeExit(1);
};
