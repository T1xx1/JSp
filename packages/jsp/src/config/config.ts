import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { cwd } from 'node:process';

import { tryCatchSync } from '../polyfills/index.js';
import { exit, panic } from '../utils/index.js';

export type Config = {
	include?: string[];
	exclude?: string[];
	compiler?: {
		emitLang?: 'JavaScript' | 'TypeScript';
		emitDir?: string;
	};
};
export const initialConfig = {
	$schema: 'https://raw.githubusercontent.com/t1xx1/jsp/refs/heads/main/packages/jsp/config.json',
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
/**
 * Get the JS+ config in the current working directory.
 * @returns `{}` or the JS+ config
 */
export const getConfig = (): Config => {
	let configPath = existsConfig();

	if (configPath === false) {
		return {};
	}

	/* `.json` config */
	if (configPath.endsWith('.json')) {
		const { data, error } = tryCatchSync(() => {
			return JSON.parse(readFileSync(configPath, 'utf8')) as Config;
		});

		if (error || !data) {
			throw exit('Cannot parse JS+ config');
		}

		return data;
	}

	/* `.ts` config */
	if (configPath.endsWith('.ts')) {
		const { data, error } = tryCatchSync(() => {
			return createRequire(import.meta.url)(configPath).default as Config;
		});

		if (error || !data) {
			throw exit('Cannot require JS+ config');
		}

		return data;
	}

	throw panic('MLA2Z3XNHX', 'Hit invalid code');
};
export const initConfig = () => {
	if (existsConfig() !== false) {
		throw exit('JS+ config is already initialized');
	}

	let configPath: string;

	if (existsSync(join(cwd(), '.config'))) {
		configPath = join(cwd(), '.config/jsp.json');
	} else {
		configPath = join(cwd(), 'jsp.config.json');
	}

	writeFileSync(configPath, JSON.stringify(initialConfig, null, '\t'), 'utf8');
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
