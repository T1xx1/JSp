import { exit } from 'node:process';

import chalk from 'chalk';

export const panic = (duid: string, message: string, error?: Error): never => {
	console.log(chalk.red(`Panic (${duid}): ${message}`));

	if (error) {
		console.error(error);
	}

	exit();
};
