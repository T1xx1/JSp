import { Command } from 'commander';

import { compileDir } from '../compiler/index.js';
import { getConfig, mergeConfig } from '../config/index.js';
import { log } from '../utils/index.js';

const cli = new Command();

cli.name('JS+').version('0.1.0');

cli
	.command('build')
	.description('compile JS+ files')
	.action(() => {
		const config = mergeConfig(getConfig() ?? {});

		compileDir(config);

		log.success('JS+ compiled successfully');
	});

cli.parse();
