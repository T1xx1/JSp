import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { normalize } from 'node:path';
import { cwd } from 'node:process';

import { join, printExitDiagnostic, tryCatchSync } from './_.js';

/* prettier-ignore */
export type Config = {
	rootDir?: string;
	include?: string[];
	exclude?: string[];
	compiler?: {
		emitDir?: string;
		emitCode: boolean;
		emitCodeLang?: 'JavaScript' | 'TypeScript';
		emitSourceMaps?: boolean;
	};
};

/**
 * Checks if a config exists in the project directory
 * @returns `false` or the user config path
 */
export const existsConfig = (): false | string => {
	if (existsSync(join(cwd(), 'config/jsp.ts'))) {
		return join(cwd(), 'config/jsp.ts');
	}
	if (existsSync(join(cwd(), 'jsp.config.ts'))) {
		return join(cwd(), 'jsp.config.ts');
	}

	return false;
};
/**
 * Get the config in the project directory
 * @returns `{}` or the user config
 */
export const getConfig = (): Config => {
	let configPath = existsConfig();

	if (configPath === false) {
		return {};
	}

	const { data, error } = tryCatchSync(() => {
		return createRequire(import.meta.url)(configPath) as Config;
	});

	if (error || !data) {
		throw printExitDiagnostic('Error', 'Cannot import config');
	}

	return data;
};

/* prettier-ignore */
export type CompleteConfig = Required<Config> & {
	compiler: Required<Config['compiler']>;
};

export const defaultCompleteConfig: CompleteConfig = {
	rootDir: './src',
	include: ['./**'],
	exclude: [],
	compiler: {
		emitDir: './dist',
		emitCode: true,
		emitCodeLang: 'TypeScript',
		emitSourceMaps: false,
	},
};

/**
 * Parse and merge missing user config properties with the default config
 */
export const parseConfig = (config: Config): CompleteConfig => {
	const c: Partial<Record<keyof CompleteConfig, any>> & {
		compiler: Partial<Record<keyof CompleteConfig['compiler'], any>>;
	} = {
		rootDir: config.rootDir ?? defaultCompleteConfig.rootDir,
		include: config.include ?? defaultCompleteConfig.include,
		exclude: config.exclude ?? defaultCompleteConfig.exclude,
		compiler: {},
	};

	/* emitDir */
	const emitDir = config.compiler?.emitDir ?? defaultCompleteConfig.compiler.emitDir;
	const normalizedEmitDir = normalize(emitDir);

	if (c.include.includes(normalizedEmitDir)) {
		throw printExitDiagnostic('Error', '`compiler.emitDir` cannot be in `include`');
	}
	if (normalizedEmitDir === normalize(c.rootDir)) {
		throw printExitDiagnostic('Error', '`compiler.emitDir` cannot be the `rootDir`');
	}

	c.compiler.emitDir = emitDir;

	/*  */

	c.compiler.emitCode = config.compiler?.emitCode ?? defaultCompleteConfig.compiler.emitCode;
	c.compiler.emitCodeLang =
		config.compiler?.emitCodeLang ?? defaultCompleteConfig.compiler.emitCodeLang;

	/* emitSourceMaps */
	const emitSourceMaps =
		config.compiler?.emitSourceMaps ?? defaultCompleteConfig.compiler.emitSourceMaps;

	if (c.compiler.emitCode === false && emitSourceMaps === true) {
		throw printExitDiagnostic('Error', 'Cannot emit source maps if `compiler.emitCode` is `false`');
	}

	c.compiler.emitSourceMaps = emitSourceMaps;

	/*  */

	return c as CompleteConfig;
};

/**
 * Get the config in the project directory
 */
export const getCompleteConfig = (): CompleteConfig => {
	return parseConfig(getConfig());
};
