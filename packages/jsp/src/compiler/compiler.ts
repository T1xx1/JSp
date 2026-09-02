import { readFileSync, rmSync } from 'node:fs';

import chalk from 'chalk';

import jspPackageJson from '../../package.json' with { type: 'json' };

import type { Config } from '../core/config/config.js';
import { parse } from '../core/parser.js';
import { getSourceFileNames } from '../core/utils/fs.js';
import type { PackageJson } from '../core/utils/packageJson.js';

export const compiler = ({
	cwd,
	packageJson,
	config,
}: {
	cwd: string;
	packageJson: PackageJson;
	config: Config;
}): void => {
	console.log(`${chalk.green('JS+')} ${jspPackageJson.version}\n`);

	if (config.dev.wipeOutputDir) {
		rmSync(config.compiler.outputDir, {
			recursive: true,
			force: true,
		});
	}

	const fileNames = getSourceFileNames(config);

	for (const fileName of fileNames) {
		console.log(fileName);

		const fileContent = readFileSync(fileName, 'utf8');

		const ast = parse({
			file: {
				name: fileName,
				content: fileContent,
			},
		});

		console.log(ast);
	}
};
