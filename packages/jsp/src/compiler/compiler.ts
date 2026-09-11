import { readFileSync, rmSync, writeFileSync } from 'node:fs';

import chalk from 'chalk';

import jspPackageJson from '../../package.json' with { type: 'json' };

import type { Config } from '../core/config/config.js';
import { parse } from '../core/parser.js';
import { changeExt, emitInOutputDir, getExt, getSourceFileNames } from '../core/utils/fs.js';
import type { PackageJson } from '../core/utils/packageJson.js';
import { checkExt, checkJsType } from '../core/utils/module.js';
import { print } from '../core/utils/print.js';

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

	if (fileNames.length === 0) {
		print({
			message:
				'No files were found with current configuration of `compiler.srcDir/include/exclude`.',
			severity: 'info',
		});
	}

	for (const fileName of fileNames) {
		const fileExt = getExt(fileName);

		checkExt(fileExt);
		checkJsType(fileExt);

		const fileContent = readFileSync(fileName, 'utf8');

		const ast = parse(fileContent);

		if (config.compiler.emitSourceAst) {
			emitInOutputDir({
				file: {
					name: changeExt({
						fileName,
						newExt: '.ast.json',
					}),
					content: JSON.stringify(ast, null, '\t'),
				},
				config,
			});
		}
	}
};
