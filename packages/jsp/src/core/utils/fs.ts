import { existsSync, globSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, format, join, parse, relative } from 'node:path';

import type { Config } from '../config/config.js';

export type File = {
	name: string;
	content: string;
};

export const getSourceFileNames = (config: Config): string[] => {
	return globSync(
		config.compiler.include.map((path) => {
			return join(config.compiler.srcDir, path);
		}),
		{
			exclude: ['node_modules'],
		},
	).filter((fileName) => {
		return fileName.endsWith('.jsp');
	});
};

/*  */

export const changeExt = ({ fileName, newExt }: { fileName: string; newExt: string }): string => {
	const parsedFileName = parse(fileName);

	parsedFileName.base = '';
	parsedFileName.ext = newExt;

	return format(parsedFileName);
};

/*  */

export const emit = (file: File): void => {
	const dirName = dirname(file.name);

	if (!existsSync(dirName)) {
		mkdirSync(dirName, {
			recursive: true,
		});
	}

	writeFileSync(file.name, file.content);
};

export const emitInOutputDir = ({ file, config }: { file: File; config: Config }) => {
	emit({
		name: join(config.compiler.outputDir, relative(config.compiler.srcDir, file.name)),
		content: file.content,
	});
};
