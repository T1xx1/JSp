import chalk from 'chalk';
import { Command } from 'commander';

import { compile, getInputs } from '../compiler/index.js';
import { getConfig, initConfig, mergeConfig } from '../config/index.js';

const cli = new Command();

cli.name('JS+').version('0.1.0');

cli.command('init').description('init JS+ config').action(initConfig);

cli
	.command('build')
	.description('compile JS+ files')
	.action(() => {
		const config = mergeConfig(getConfig() ?? {});

		const inputs = getInputs(config);

		for (const input of inputs) {
			compile(input, config);
		}

		console.log(chalk.green('JS+ compiled successfully'));
	});

cli.parse();
