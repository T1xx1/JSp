import { existsSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { exit } from 'node:process';

import { z } from 'zod';

import { importSync } from '../../tslib/server/importSync.server.js';
import { print } from '../utils/print.js';
import type { Config as PartialConfig } from './schema.js';

const configName = 'jsp.config.ts';

export const getConfig = (cwd: string): PartialConfig => {
	const path = join(cwd, configName);

	if (!existsSync(path)) {
		return {};
	}

	return (
		importSync(path) as {
			default: PartialConfig;
		}
	).default;
};

const defaultConfig = {
	compiler: {
		srcDir: normalize('./src'),
		include: ['./**'].map((glob) => {
			return normalize(glob);
		}),
		exclude: [],
		outputDir: normalize('./dist'),
	},
	dev: {
		wipeOutputDir: true,
	},
} satisfies PartialConfig;

export const configSchema = z
	.object({
		compiler: z
			.object({
				srcDir: z
					.string()
					.exactOptional()
					.default(defaultConfig.compiler.srcDir)
					.transform((path) => {
						return normalize(path);
					}),
				include: z
					.array(z.string())
					.exactOptional()
					.default(defaultConfig.compiler.include)
					.transform((globs) => {
						return globs.map((glob) => {
							return normalize(glob);
						});
					}),
				exclude: z
					.array(z.string())
					.exactOptional()
					.default(defaultConfig.compiler.exclude)
					.transform((globs) => {
						return globs.map((glob) => {
							return normalize(glob);
						});
					}),
				outputDir: z
					.string()
					.exactOptional()
					.default(defaultConfig.compiler.outputDir)
					.transform((path) => {
						return normalize(path);
					}),
			})
			.exactOptional()
			.default(defaultConfig.compiler),
		dev: z
			.object({
				wipeOutputDir: z.boolean().exactOptional().default(defaultConfig.dev.wipeOutputDir),
			})
			.exactOptional()
			.default(defaultConfig.dev),
	})
	.exactOptional()
	.default(defaultConfig)
	.superRefine((obj, ctx) => {
		for (const glob of [...obj.compiler.include, ...obj.compiler.exclude]) {
			if (glob.startsWith(obj.compiler.srcDir)) {
				ctx.addIssue({
					code: 'custom',
					message:
						'Globs from `compiler.include/exclude` are already resolved in `compiler.srcDir`',
					path: ['compiler'],
				});

				break;
			}
		}

		if (obj.compiler.outputDir === obj.compiler.srcDir) {
			ctx.addIssue({
				code: 'custom',
				message: '`compiler.outputDir` cannot be `compiler.srcDir`.',
				path: ['compiler', 'outputDir'],
			});
		}
		if (obj.compiler.outputDir.startsWith(obj.compiler.srcDir)) {
			ctx.addIssue({
				code: 'custom',
				message: '`compiler.outputDir` cannot be a subdirectory of `compiler.srcDir`.',
				path: ['compiler', 'outputDir'],
			});
		}
		if (obj.compiler.include.includes(obj.compiler.outputDir)) {
			ctx.addIssue({
				code: 'custom',
				message: '`compiler.outputDir` cannot be in `compiler.include`.',
				path: ['compiler', 'outputDir'],
			});
		}
		if (obj.compiler.exclude.includes(obj.compiler.outputDir)) {
			ctx.addIssue({
				code: 'custom',
				message: '`compiler.outputDir` is already excluded.',
				path: ['compiler', 'outputDir'],
			});
		}
	});

export type Config = z.infer<typeof configSchema>;

export const checkConfig = ({ config }: { config: PartialConfig }): Config => {
	const configValidation = configSchema.safeParse(config);

	if (!configValidation.success) {
		for (const issue of configValidation.error.issues) {
			print({
				message: `${issue.message} at \`${issue.path.join('.')}\``,
				severity: 'error',
			});
		}

		exit(1);
	}

	return configValidation.data;
};
