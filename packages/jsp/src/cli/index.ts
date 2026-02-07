import { Command } from 'commander';

import { build } from '../compiler/index.js';
import { initConfig } from '../config/index.js';

const cli = new Command();

cli.name('JS+').version('0.1.0');

cli.command('init').description('init JS+ config').action(initConfig);

cli
	.command('build')
	.description('compile JS+ files')
	.action(async () => await build());

cli.parse();
