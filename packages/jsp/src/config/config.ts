import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, normalize } from 'node:path';
import { cwd } from 'node:process';

import { panic, printDiagnostic, printExitDiagnostic, tryCatchSync } from '../utils/index.js';

export type Config = {
	rootDir?: string;
	include?: string[];
	exclude?: string[];
	compiler?: {
		emitEnabled?: boolean;
		emitLang?: 'JavaScript' | 'TypeScript';
		emitDir?: string;
		emitSourceMaps?: boolean;
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
			throw printExitDiagnostic('Error', 'Cannot parse JS+ config');
		}

		return data;
	}

	/* `.ts` config */
	if (configPath.endsWith('.ts')) {
		const { data, error } = tryCatchSync(() => {
			return createRequire(import.meta.url)(configPath) as Config;
		});

		if (error || !data) {
			throw printExitDiagnostic('Error', 'Cannot require JS+ config');
		}

		return data;
	}

	throw panic('MLA2Z3XNHX', 'Hit invalid code');
};

/* complete config */
export type CompleteConfig = Required<Config> & {
	compiler: Required<Config['compiler']>;
};
export const completeConfig: CompleteConfig = {
	rootDir: './src',
	include: ['./**'],
	exclude: [],
	compiler: {
		emitEnabled: true,
		emitLang: 'TypeScript',
		emitDir: './dist',
		emitSourceMaps: false,
	},
};

/**
 * Merge missing JS+ config properties with the default JS+ config properties.
 * @returns JS+ config with all properties
 */
export const mergeConfig = (config: Config): CompleteConfig => {
	return {
		rootDir: config.rootDir ?? completeConfig.rootDir,
		include: config.include ?? completeConfig.include,
		exclude: config.exclude ?? completeConfig.exclude,
		compiler: {
			emitEnabled: config.compiler?.emitEnabled ?? completeConfig.compiler.emitEnabled,
			emitLang: config.compiler?.emitLang ?? completeConfig.compiler.emitLang,
			emitDir: config.compiler?.emitDir ?? completeConfig.compiler.emitDir,
			emitSourceMaps: config.compiler?.emitSourceMaps ?? completeConfig.compiler.emitSourceMaps,
		},
	};
};
/**
 * Parses JS+ config and throws on errors.
 */
export const parseConfig = (config: CompleteConfig): void => {
	if (config.compiler.emitEnabled === false && config.compiler.emitLang) {
		printDiagnostic(
			'Warning',
			'`compiler.emitLang` is ignored when `compiler.emitEnabled` is disabled',
		);
	}
	if (config.compiler.emitEnabled === false && config.compiler.emitDir) {
		printDiagnostic(
			'Warning',
			'`compiler.emitDir` is ignored when `compiler.emitEnabled` is disabled',
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
 * Get the JS+ complete config in the current working directory.
 * `@returns` The JS+ complete config with all properties populated
 */
export const getCompleteConfig = (): CompleteConfig => {
	const completeConfig = mergeConfig(getConfig());

	parseConfig(completeConfig);

	return completeConfig;
};
