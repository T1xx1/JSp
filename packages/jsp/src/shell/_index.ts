import { Command } from 'commander';

import packageJson from '../../package.json' with { type: 'json' };

import { compile } from './compile.js';
import { exe } from './exe.js';
import { ast } from './ast.js';

const shell = new Command('JS+')
	.version(packageJson.version, '--version, -v', 'print version')
	.addCommand(
		new Command('version')
			.alias('v')
			.description('print version')
			.action(() => {
				console.log(packageJson.version);
			}),
		{
			hidden: true,
		},
	)
	.helpOption('--help, -h', 'print help')
	.helpCommand('help [command]', 'print help');

shell
	.command('compile')
	.alias('c')
	.description('compile')
	.argument('[fileNames...]')
	.action((fileNames: string[]) => {
		compile(fileNames);
	});

shell
	.command('exe', {
		isDefault: true,
	})
	.alias('e')
	.description('exe')
	.argument('[fileName]')
	.action((fileName?: string) => {
		if (!fileName) {
			shell.help();

			return;
		}

		exe(fileName);
	});

/*  */

shell
	.command('ast', {
		hidden: true,
	})
	.description('tree')
	.argument('<fileName>')
	.action((fileName: string) => {
		ast(fileName);
	});

/*  */

shell.parse();
