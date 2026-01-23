import { existsSync, readFileSync } from 'node:fs';

import { tryCatchSync } from '../polyfills/trycatch.js';
import { joinCwd } from '../utils/lib.js';

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
			console.error('JS+ error: failed to parse config');
			console.error(error);

			process.exit();
		}

		return data;
	}

	/* undefined config */
	return null;
};

export const getInitConfig = () => {
	return {
		$schema: 'https://github.com/t1xx1/jsp/blob/main/packages/jsp/src/config/$schema.json',
	};
};

export type CompleteConfig = Required<Config> & {
	compiler: Required<Config['compiler']>;
};
export const completeConfig: CompleteConfig = {
	include: ['./**'],
	exclude: [],
	compiler: {
		emitLang: 'JavaScript',
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
