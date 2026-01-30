import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd, exit } from 'node:process';

import { tryCatchSync } from '../polyfills/index.js';
import { log } from '../utils/index.js';

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

	if (existsSync(join(cwd(), 'config/jsp.json'))) {
		configPath = join(cwd(), 'config/jsp.json');
	}
	if (existsSync(join(cwd(), 'config/jsp.ts'))) {
		configPath = join(cwd(), 'config/jsp.ts');
	}
	if (existsSync(join(cwd(), 'jsp.config.json'))) {
		configPath = join(cwd(), 'jsp.config.json');
	}
	if (existsSync(join(cwd(), 'jsp.config.ts'))) {
		configPath = join(cwd(), 'jsp.config.ts');
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
		$schema: 'https://raw.githubusercontent.com/t1xx1/jsp/refs/heads/main/packages/jsp/config.json',
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
