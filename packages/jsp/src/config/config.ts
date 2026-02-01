import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd, exit } from 'node:process';

import chalk from 'chalk';

import { tryCatchSync } from '../polyfills/index.js';

export type Config = {
	include?: string[];
	exclude?: string[];
	compiler?: {
		emitLang?: 'JavaScript' | 'TypeScript';
		emitDir?: string;
	};
};

/**
 * Checks if a JS+ config exists in the current working directory.
 * @returns `false` or the config path
 */
export const existsConfig = (): false | string => {
	if (existsSync(join(cwd(), 'config/jsp.json'))) {
		return join(cwd(), 'config/jsp.json');
	}
	if (existsSync(join(cwd(), 'config/jsp.ts'))) {
		return join(cwd(), 'config/jsp.ts');
	}
	if (existsSync(join(cwd(), 'jsp.config.json'))) {
		return join(cwd(), 'jsp.config.json');
	}
	if (existsSync(join(cwd(), 'jsp.config.ts'))) {
		return join(cwd(), 'jsp.config.ts');
	}

	return false;
};
export const getConfig = (): Config => {
	let configPath = existsConfig();

	if (configPath === false) {
		return {};
	}

	const { data, error } = tryCatchSync(() => {
		return JSON.parse(readFileSync(configPath, 'utf8')) as Config;
	});

	if (error || !data) {
		console.log(chalk.red('Cannot parse JS+ config'));

		exit();
	}

	return data;
};

export const getInitConfig = () => {
	return {
		$schema: 'https://raw.githubusercontent.com/t1xx1/jsp/refs/heads/main/packages/jsp/config.json',
	};
};

/* complete config */
export type CompleteConfig = Required<Config> & {
	compiler: Required<Config['compiler']>;
};
export const completeConfig: CompleteConfig = {
	include: ['./**'],
	exclude: [],
	compiler: {
		emitLang: 'TypeScript',
		emitDir: './dist',
	},
};

export const mergeConfig = (config: Config): CompleteConfig => {
	return {
		include: config.include ?? completeConfig.include,
		exclude: config.exclude ?? completeConfig.exclude,
		compiler: {
			emitLang: config.compiler?.emitLang ?? completeConfig.compiler.emitLang,
			emitDir: config.compiler?.emitDir ?? completeConfig.compiler.emitDir,
		},
	};
};
export const getCompleteConfig = (): CompleteConfig => {
	return mergeConfig(getConfig());
};

export const initConfig = () => {
	if (existsConfig() !== false) {
		console.log(chalk.gray('JS+ config is already initialized'));

		exit();
	}

	let configPath: string;

	if (existsSync(join(cwd(), '.config'))) {
		configPath = join(cwd(), '.config/jsp.json');
	} else {
		configPath = join(cwd(), 'jsp.config.json');
	}

	writeFileSync(configPath, JSON.stringify(getInitConfig(), null, '\t'), 'utf8');
};
