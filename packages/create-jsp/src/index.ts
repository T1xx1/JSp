import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { argv, cwd, env, exit } from 'node:process';
import { fileURLToPath } from 'node:url';

import * as prompts from '@clack/prompts';
import chalk from 'chalk';

import { recursiveCopySync } from './utils.js';

const SCRIPT_ROOT = fileURLToPath(import.meta.url);
const TEMPLATES_ROOT = join(SCRIPT_ROOT, '..', 'templates');

const IS_DEV = argv.includes('--dev');

const CWD = IS_DEV ? join(SCRIPT_ROOT, '..', '..', '..', '..', '..', '..', 'Sandbox') : cwd();

const PACKAGE_MANAGER = (env['npm_config_user_agent'] ?? 'npm').split('/')[0]!;

const canCancel = <T>(prompt: T | symbol) => {
	if (prompts.isCancel(prompt)) {
		prompts.cancel('Cancelled');

		exit(0);
	}

	return prompt as T;
};

const main = async () => {
	/* 1. name */
	const name = canCancel(
		await prompts.text({
			message: 'Insert project name:',
			placeholder: 'jsp-project',
			defaultValue: 'jsp-project',
		}),
	);

	const targetDir = join(CWD, name);

	/* non-empty directory */
	if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
		const overwrite = canCancel(
			await prompts.select({
				message: `Directory ${name} is not empty`,
				options: [
					{
						label: 'Overwrite',
						value: true,
					},
					{
						label: 'Cancel',
						value: false,
					},
				],
			}),
		);

		if (!overwrite) {
			prompts.cancel('Cancelled');

			exit(0);
		}

		rmSync(targetDir, { recursive: true });
	}

	mkdirSync(targetDir);

	/* 2. template */
	const template = 'vanilla';
	/* const template = canCancel(
		await prompts.select({
			message: 'Select project template:',
			options: [
				{
					label: chalk.hex('#31C433')('Vanilla'),
					value: 'vanilla',
				},
			],
		}),
	); */

	const templateDir = join(TEMPLATES_ROOT, template);

	/* scaffold */
	prompts.log.step(chalk.gray('Scaffolding project...'));

	recursiveCopySync(templateDir, targetDir);

	/* package.json */
	const packageJson = JSON.parse(readFileSync(join(templateDir, 'package.json'), 'utf8'));

	packageJson.name = name;

	if (IS_DEV) {
		packageJson.devDependencies['@jsplang/jsp'] = 'link:../../Dev/JSp/packages/jsp';
	}

	writeFileSync(join(targetDir, 'package.json'), JSON.stringify(packageJson, null, '\t'), 'utf8');

	prompts.log.step(chalk.gray('Project scaffolded'));

	const installDeps = canCancel(
		await prompts.confirm({
			message: 'Install dependencies?',
		}),
	);

	if (installDeps) {
		prompts.log.step(chalk.gray('Installing dependencies...'));

		spawnSync(PACKAGE_MANAGER, ['install'], { cwd: targetDir });

		prompts.log.step(chalk.gray('Dependencies installed'));
	}

	prompts.outro(chalk.green('Done'));

	console.log('Run:');
	console.log(` 1. \`cd ${name}\` to cd into the directory`);

	if (installDeps === false) {
		console.log(` 2. \`${PACKAGE_MANAGER} install\` to install dependencies`);
	}

	console.log(` 3. \`${PACKAGE_MANAGER} run dev\` to start the dev server`);
	console.log();
};

try {
	await main();
} catch (error) {
	console.error(error);

	exit(1);
}
