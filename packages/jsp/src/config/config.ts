import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, normalize } from 'node:path';
import { cwd } from 'node:process';

import { printExitDiagnostic, tryCatchSync } from '../utils/index.js';

/* prettier-ignore */
export type UserConfig = {
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
 * Checks if a user config exists in the project directory
 * @returns `false` or the user config path
 */
export const existsUserConfig = (): false | string => {
	if (existsSync(join(cwd(), 'config/jsp.ts'))) {
		return join(cwd(), 'config/jsp.ts');
	}
	if (existsSync(join(cwd(), 'jsp.config.ts'))) {
		return join(cwd(), 'jsp.config.ts');
	}

	return false;
};
/**
 * Get the user config in the project directory
 * @returns `{}` or the user config
 */
export const getUserConfig = (): UserConfig => {
	let userConfigPath = existsUserConfig();

	if (userConfigPath === false) {
		return {};
	}

	const { data, error } = tryCatchSync(() => {
		return createRequire(import.meta.url)(userConfigPath) as UserConfig;
	});

	if (error || !data) {
		throw printExitDiagnostic('Error', 'Cannot import config');
	}

	return data;
};

/* prettier-ignore */
export type Config = Required<UserConfig> & {
	compiler: Required<UserConfig['compiler']>;
};

export const defaultConfig: Config = {
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
export const mergeConfig = (userConfig: UserConfig): Config => {
	const config: Partial<Record<keyof Config, any>> & {
		compiler: Partial<Record<keyof Config['compiler'], any>>;
	} = {
		rootDir: userConfig.rootDir ?? defaultConfig.rootDir,
		include: userConfig.include ?? defaultConfig.include,
		exclude: userConfig.exclude ?? defaultConfig.exclude,
		compiler: {},
	};

	/* emitDir */
	const emitDir = userConfig.compiler?.emitDir ?? defaultConfig.compiler.emitDir;
	const normalizedEmitDir = normalize(emitDir);

	if (config.include.includes(normalizedEmitDir)) {
		throw printExitDiagnostic('Error', '`compiler.emitDir` cannot be in `include`');
	}
	if (normalizedEmitDir === normalize(config.rootDir)) {
		throw printExitDiagnostic('Error', '`compiler.emitDir` cannot be the `rootDir`');
	}

	config.compiler.emitDir = emitDir;

	config.compiler.emitCodeLang =
		userConfig.compiler?.emitCodeLang ?? defaultConfig.compiler.emitCodeLang;

	/* emitSourceMaps */
	const emitSourceMaps =
		userConfig.compiler?.emitSourceMaps ?? defaultConfig.compiler.emitSourceMaps;

	if (config.compiler.emitCode === false && emitSourceMaps === true) {
		throw printExitDiagnostic('Error', 'Cannot emit source maps if `compiler.emitCode` is `false`');
	}

	config.compiler.emitSourceMaps = emitSourceMaps;

	return config as Config;
};

/**
 * Get the config in the project directory
 */
export const getConfig = (): Config => {
	return mergeConfig(getUserConfig());
};
