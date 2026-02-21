import { exit } from 'node:process';

import chalk from 'chalk';

export const panic = (duid: string, message: string, error?: Error): never => {
	if (error) {
		console.error(error);
	}

	console.log(chalk.red(`Panic (${duid}): ${message}`));

	exit(1);
};
