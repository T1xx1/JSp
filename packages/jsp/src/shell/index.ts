import { spawnSync } from 'node:child_process';

import { Command } from 'commander';

import {
	PACKAGE_JSON,
	RUNTIME,
	build,
	getCompleteConfig,
	getDependencyVersion,
} from '../compiler/_.js';

import { colorChalk } from './color.js';

/*  */

const shell = new Command();

shell
	.name('JS+')
	.version(PACKAGE_JSON.version, '-v, --version', 'log JS+ version')
	.helpOption('-h, --help', 'log help information');

shell
	.command('info')
	.description('log JS+ bindings')
	.action(() => {
		console.log(colorChalk.jsp(`JS+        ${PACKAGE_JSON.version}`));
		console.log(colorChalk.babel(`Babel      ${getDependencyVersion('@babel/core')!}`));
		console.log(colorChalk.typescript(`TypeScript ${getDependencyVersion('typescript')!}`));
		console.log(colorChalk.javascript(`JavaScript ESNext ESM`));
		console.log(colorChalk.node(`Node       ${PACKAGE_JSON.engines.node}`));
	});

/*  */

shell
	.command('compile')
	.description('compile JS+ file')
	.argument('<filename>', 'JS+ file to compile')
	.action(async (filename) => {
		const config = getCompleteConfig();

		config.include = [filename];

		await build(config);
	});

shell
	.command('exe')
	.description('compile and execute JS+ file')
	.argument('<filename>', 'JS+ file to compile and execute')
	.action(async (filename) => {
		const config = getCompleteConfig();

		config.include = [filename];

		await build(config);

		spawnSync(RUNTIME, [filename]);
	});

/*  */

shell
	.command('build')
	.description('compile JS+ files')
	.action(async () => {
		await build(getCompleteConfig());
	});

/*  */

shell.parse();
