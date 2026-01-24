import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd, exit } from 'node:process';

import { Command } from 'commander';

import { compileDir } from '../compiler/index.js';
import { getConfig, getInitConfig, mergeConfig } from '../config/index.js';
import { log } from '../utils/index.js';

const cli = new Command();

cli.name('JS+').version('0.1.0');

cli
	.command('init')
	.description('init JS+ config')
	.action(() => {
		if (getConfig() !== null) {
			log.info('JS+ config is already initialized');

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

		compileDir(config);

		log.success('JS+ compiled successfully');
	});

cli.parse();
