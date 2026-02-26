import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';
import { Command } from 'commander';

import { build } from '../compiler/index.js';
import { getConfig } from '../config/index.js';

import { getRuntime, type PackageJson } from './utils.js';

const SCRIPT_ROOT = fileURLToPath(import.meta.url);

const SCRIPT_PACKAGE_JSON = JSON.parse(
	readFileSync(join(SCRIPT_ROOT, '..', '..', '..', 'package.json'), 'utf8'),
) as PackageJson;

const RUNTIME = getRuntime();

/*  */

const shell = new Command();

shell
	.name('JS+')
	.version(SCRIPT_PACKAGE_JSON.version, '-v, --version', 'log JS+ version')
	.helpOption('-h, --help', 'log help information');

shell
	.command('info')
	.description('log JS+ bindings')
	.action(() => {
		console.log(`${chalk.hex('#31C433')('JS+')}        ${SCRIPT_PACKAGE_JSON.version}`);
		console.log(
			`${chalk.hex('#F9DC3E')('Babel')}      ${SCRIPT_PACKAGE_JSON.dependencies['@babel/core'].replaceAll('^', '')}`,
		);
		console.log(
			`${chalk.hex('#3178C6')('TypeScript')} ${SCRIPT_PACKAGE_JSON.devDependencies['typescript'].replaceAll('^', '')}`,
		);
		console.log(`${chalk.hex('#F0DB4F')('JavaScript')} ESNext ESM`);
		console.log(`${chalk.hex('#84B464')('Node')}       ${SCRIPT_PACKAGE_JSON.engines.node}`);
	});

/*  */

shell
	.command('compile')
	.description('compile JS+ file')
	.argument('<filename>', 'JS+ file to compile')
	.action(async (filename) => {
		const config = getConfig();

		config.include = [filename];

		await build(config);
	});

shell
	.command('exe')
	.description('compile and execute JS+ file')
	.argument('<filename>', 'JS+ file to compile and execute')
	.action(async (filename) => {
		const config = getConfig();

		config.include = [filename];

		await build(config);

		spawnSync(RUNTIME, [filename]);
	});

shell
	.command('build')
	.description('compile JS+ files')
	.action(async () => {
		await build(getConfig());
	});

/*  */

shell.parse();
