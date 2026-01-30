import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd, exit } from 'node:process';

import chalk from 'chalk';
import { Command } from 'commander';

import { compile } from '../compiler/index.js';
import { getConfig, getInitConfig, mergeConfig } from '../config/index.js';

import { getInputs } from './inputs.js';

const cli = new Command();

cli.name('JS+').version('0.1.0');

cli
	.command('init')
	.description('init JS+ config')
	.action(() => {
		if (getConfig() !== null) {
			console.log(chalk.gray('JS+ config is already initialized'));

			exit();
		}

		let configPath = cwd();

		if (existsSync(join(cwd(), '.config'))) {
			configPath = join(configPath, '.config/jsp.json');
		} else {
			configPath = join(configPath, 'jsp.config.json');
		}

		writeFileSync(configPath, JSON.stringify(getInitConfig(), null, '\t'), 'utf8');
	});

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
