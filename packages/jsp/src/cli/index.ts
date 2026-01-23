import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';


import { compile } from '../compiler/index.js';
import { mergeConfig, type CompleteConfig, type Config } from '../config/index.js';
import { tryCatchSync } from '../polyfills/trycatch.js';
import { joinCwd } from '../utils/lib.js';

const args = process.argv.slice(2);

/* config */
let config: null | CompleteConfig = null;
let configPath: null | string = null;

if (fs.existsSync(joinCwd('config/jsp.json'))) {
	configPath = joinCwd('config/jsp.json');
}
if (fs.existsSync(joinCwd('config/jsp.ts'))) {
	configPath = joinCwd('config/jsp.ts');
}
if (fs.existsSync(joinCwd('jsp.config.json'))) {
	configPath = joinCwd('jsp.config.json');
}
if (fs.existsSync(joinCwd('jsp.config.ts'))) {
	configPath = joinCwd('jsp.config.ts');
}

if (configPath) {
	const { data, error } = tryCatchSync(() => {
		return JSON.parse(fs.readFileSync(configPath, 'utf8')) as Config;
	});

	if (error || !data) {
		console.error('JS+ error: failed to parse config');
		console.error(error);

		process.exit();
	}

	config = mergeConfig(data);
}

/* not defined config */
if (!config) {
	config = mergeConfig({});
}

/* main */

const compileDir = (filenames: string[]) => {
	for (const filename of filenames) {
		if (fs.statSync(filename).isDirectory()) {
			compileDir(fs.readdirSync(filename).map((f) => path.join(filename, f)));

			continue;
		}

		/* file */
		const emit = joinCwd(
			config.compiler.emitDir,
			filename.split('\\').slice(1).join('\\').replace('.jsp', '.js'),
		);

		fs.mkdirSync(path.dirname(emit), { recursive: true });

		fs.writeFileSync(emit, compile(fs.readFileSync(filename, 'utf8')), 'utf8');
	}
};

compileDir(config.include);
