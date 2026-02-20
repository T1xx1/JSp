import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';
import { Command } from 'commander';

import { build } from '../compiler/index.js';
import { getCompleteConfig, initConfig, mergeConfig, type Config } from '../config/index.js';

const rootPackageJson = JSON.parse(
	readFileSync(join(fileURLToPath(import.meta.url), '../../../../../package.json'), 'utf8'),
);
const packageJson = JSON.parse(
	readFileSync(join(fileURLToPath(import.meta.url), '../../../package.json'), 'utf8'),
);

const shell = new Command();

shell.name('JS+').version('0.1.0');

shell.command('init').description('init JS+ config').action(initConfig);

shell
	.command('info')
	.description('log JS+ versions')
	.action(() => {
		console.log(`${chalk.hex('#31C433')('JS+')}        ${packageJson.version}`);
		console.log(
			`${chalk.hex('#F9DC3E')('Babel')}      ${packageJson.dependencies['@babel/core'].replaceAll('^', '')}`,
		);
		console.log(
			`${chalk.hex('#3178C6')('TypeScript')} ${packageJson.devDependencies['typescript'].replaceAll('^', '')}`,
		);
		console.log(`${chalk.hex('#F0DB4F')('JavaScript')} ESNext ESM`);
		console.log(`${chalk.hex('#84B464')('Node')}       ${rootPackageJson.engines.node}`);
	});

/*  */

shell
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

shell
	.command('build')
	.description('compile JS+ files')
	.action(async () => {
		await build(getCompleteConfig());
	});

shell.parse();
