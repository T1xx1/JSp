import { existsSync, readFileSync } from 'node:fs';
import { exit } from 'node:process';

import { tryCatchSync } from '../polyfills/index.js';
import { joinCwd, log } from '../utils/index.js';

export type Config = {
	include?: string[];
	exclude?: string[];
	compiler?: {
		emitLang?: 'JavaScript' | 'TypeScript';
		emitDir?: string;
	};
};

export const getConfig = (): null | Config => {
	let configPath: null | string = null;

	if (existsSync(joinCwd('config/jsp.json'))) {
		configPath = joinCwd('config/jsp.json');
	}
	if (existsSync(joinCwd('config/jsp.ts'))) {
		configPath = joinCwd('config/jsp.ts');
	}
	if (existsSync(joinCwd('jsp.config.json'))) {
		configPath = joinCwd('jsp.config.json');
	}
	if (existsSync(joinCwd('jsp.config.ts'))) {
		configPath = joinCwd('jsp.config.ts');
	}

	if (configPath) {
		const { data, error } = tryCatchSync(() => {
			return JSON.parse(readFileSync(configPath, 'utf8')) as Config;
		});

		if (error || !data) {
			log.error('MKYENOXQNK', 'JS+ error: failed to parse config', error);

			exit();
		}

		return data;
	}

	/* undefined config */
	return null;
};

export const getInitConfig = () => {
	return {
		$schema:
			'https://raw.githubusercontent.com/t1xx1/jsp/refs/heads/main/packages/jsp/src/config/%24schema.json',
	};
};

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
