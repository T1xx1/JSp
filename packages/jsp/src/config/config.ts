import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, normalize } from 'node:path';
import { cwd } from 'node:process';

import { panic, printDiagnostic, printExitDiagnostic, tryCatchSync } from '../utils/index.js';

export type UserConfig = {
	rootDir?: string;
	include?: string[];
	exclude?: string[];
	compiler?: {
		emitEnabled?: boolean;
		emitDir?: string;
		emitLang?: 'JavaScript' | 'TypeScript';
		emitSourceMaps?: boolean;
	};
};

/**
 * Checks if a user config exists in the project directory
 * @returns `false` or the user config path
 */
export const existsUserConfig = (): false | string => {
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
 * Get the user config in the project directory
 * @returns `{}` or the user config
 */
export const getUserConfig = (): UserConfig => {
	let userConfigPath = existsUserConfig();

	if (userConfigPath === false) {
		return {};
	}

	/* `.json` config */
	if (userConfigPath.endsWith('.json')) {
		const { data, error } = tryCatchSync(() => {
			return JSON.parse(readFileSync(userConfigPath, 'utf8')) as UserConfig;
		});

		if (error || !data) {
			throw printExitDiagnostic('Error', 'Cannot parse config');
		}

		return data;
	}

	/* `.ts` config */
	if (userConfigPath.endsWith('.ts')) {
		const { data, error } = tryCatchSync(() => {
			return createRequire(import.meta.url)(userConfigPath) as UserConfig;
		});

		if (error || !data) {
			throw printExitDiagnostic('Error', 'Cannot import config');
		}

		return data;
	}

	throw panic('MLA2Z3XNHX', 'Invalid case hit');
};

export type Config = Required<UserConfig> & {
	compiler: Required<UserConfig['compiler']>;
};

export const defaultConfig: Config = {
	rootDir: './src',
	include: ['./**'],
	exclude: [],
	compiler: {
		emitEnabled: true,
		emitDir: './dist',
		emitLang: 'TypeScript',
		emitSourceMaps: false,
	},
};

/**
 * Merge missing user config properties with the default config
 */
export const mergeConfig = (userConfig: UserConfig): Config => {
	return {
		rootDir: userConfig.rootDir ?? defaultConfig.rootDir,
		include: userConfig.include ?? defaultConfig.include,
		exclude: userConfig.exclude ?? defaultConfig.exclude,
		compiler: {
			emitEnabled: userConfig.compiler?.emitEnabled ?? defaultConfig.compiler.emitEnabled,
			emitDir: userConfig.compiler?.emitDir ?? defaultConfig.compiler.emitDir,
			emitLang: userConfig.compiler?.emitLang ?? defaultConfig.compiler.emitLang,
			emitSourceMaps: userConfig.compiler?.emitSourceMaps ?? defaultConfig.compiler.emitSourceMaps,
		},
	};
};

/**
 * Parses JS+ config and throws on errors
 */
export const parseConfig = (config: Config): void => {
	if (config.compiler.emitEnabled === false && config.compiler.emitDir) {
		printDiagnostic(
			'Warning',
			'`compiler.emitDir` is ignored when `compiler.emitEnabled` is disabled',
		);
	}
	if (config.compiler.emitEnabled === false && config.compiler.emitLang) {
		printDiagnostic(
			'Warning',
			'`compiler.emitLang` is ignored when `compiler.emitEnabled` is disabled',
		);
	}
	if (config.compiler.emitEnabled === false && config.compiler.emitSourceMaps) {
		printDiagnostic(
			'Warning',
			'`compiler.emitSourceMaps` is ignored when `compiler.emitEnabled` is disabled',
		);
	}

	/* emitDir */
	const emitDir = normalize(config.compiler.emitDir);

	if (config.include.includes(emitDir)) {
		throw printExitDiagnostic('Error', '`compiler.emitDir` cannot be included in `include`');
	}
	if (emitDir === normalize(config.rootDir)) {
		throw printExitDiagnostic('Error', '`compiler.emitDir` cannot be the root directory');
	}
};

/**
 * Get the config in the project directory
 */
export const getConfig = (): Config => {
	const userConfig = mergeConfig(getUserConfig());

	parseConfig(userConfig);

	return userConfig;
};
