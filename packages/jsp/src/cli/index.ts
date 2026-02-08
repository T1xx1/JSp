import { Command } from 'commander';

import { build } from '../compiler/index.js';
import { getCompleteConfig, initConfig, mergeConfig, type Config } from '../config/index.js';

const cli = new Command();

cli.name('JS+').version('0.1.0');

cli.command('init').description('init JS+ config').action(initConfig);

cli
	.command('compile')
	.description('compile JS+ file')
	.argument('<filename>', 'JS+ file to compile')
	.action(async (filename) => {
		const config: Config = {
			rootDir: './',
			include: [filename],
		};

		await build(mergeConfig(config));
	});

cli
	.command('build')
	.description('compile JS+ files')
	.action(async () => {
		await build(getCompleteConfig());
	});

cli.parse();
