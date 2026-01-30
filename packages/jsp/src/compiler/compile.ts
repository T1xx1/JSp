import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { cwd, exit } from 'node:process';

import { transformSync } from '@babel/core';
import chalk from 'chalk';

import type { CompleteConfig } from '../config/index.js';
import { panic } from '../utils/index.js';
import { dirname, join } from 'node:path';

export const compile = (filename: string, config: CompleteConfig) => {
	const jspCode = readFileSync(filename, 'utf8');

	if (jspCode === '') {
		console.log(chalk.gray(`${filename} is empty`));

		return;
	}

	const out = transformSync(jspCode, {
		plugins: [
			/* parse/transform TypeScript */
			config.compiler.emitLang === 'TypeScript'
				? '@babel/plugin-syntax-typescript'
				: '@babel/plugin-transform-typescript',

			/* transform custom syntax */
			'module:@jsp/plugin-transform-typeof-null-operator',
			'module:@jsp/plugin-transform-negative-array-subscript',
			'module:@jsp/plugin-transform-chained-comparisons',

			/* transform TC39 sorted by scope */
			'@babel/plugin-proposal-throw-expressions',
			'@babel/plugin-proposal-do-expressions',
			'@babel/plugin-proposal-async-do-expressions',
			[
				'@babel/plugin-proposal-discard-binding',
				{
					syntaxType: 'void',
				},
			],
			[
				'@babel/plugin-proposal-pipeline-operator',
				{
					proposal: 'hack',
					topicToken: '%',
				},
			],
			'@babel/plugin-proposal-export-default-from',
		],
	});

	if (!out || !out.code) {
		panic('MKYHKYDERU', 'Null Babel transformation');

		exit();
	}

	const emitPath = join(
		cwd(),
		config.compiler.emitDir,
		filename.replace('.jsp', config.compiler.emitLang === 'TypeScript' ? '.ts' : '.js'),
	);

	mkdirSync(dirname(emitPath), { recursive: true });

	writeFileSync(emitPath, out.code, 'utf8');
};
