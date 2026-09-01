import { existsSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { exit } from 'node:process';

import { z } from 'zod';

import { importSync } from '../../tslib/server/importSync.server.js';
import { print } from '../utils/print.js';
import type { Config } from './schema.js';

const configName = 'jsp.config.ts';

export const getConfig = ({ cwd }: { cwd: string }): Config => {
	const path = join(cwd, configName);

	if (!existsSync(path)) {
		return {};
	}

	return (
		importSync(path) as {
			default: Config;
		}
	).default;
};

const defaultConfig = {
	compiler: {
		srcDir: './src',
		outputDir: './dist',
	},
} satisfies Config;

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
	})
	.exactOptional()
	.default(defaultConfig)
	.superRefine((obj, ctx) => {
		if (obj.compiler.outputDir === obj.compiler.srcDir) {
			ctx.addIssue({
				code: 'custom',
				message: '`compiler.outputDir` cannot be `compiler.srcDir`.',
				path: ['compiler'],
			});
		}
		if (obj.compiler.outputDir.startsWith(obj.compiler.srcDir)) {
			ctx.addIssue({
				code: 'custom',
				message: '`compiler.outputDir` cannot be a subdirectory of `compiler.srcDir`.',
				path: ['compiler'],
			});
		}
	});

export type FullConfig = z.infer<typeof configSchema>;

export const checkConfig = ({ config }: { config: Config }): FullConfig => {
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
