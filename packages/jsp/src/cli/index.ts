import fs from 'node:fs';
import process from 'node:process';

import { compile } from '../compiler/index.js';
import { joinCwd } from './lib.js';

import type { Config } from '../config/index.js';
import path from 'node:path';

const args = process.argv.slice(2);

/* config */
let config = null;
let configPath = null;

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
	try {
		config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as Config;
	} catch (error) {
		console.error('JS+ error: failed to parse config');
		console.error(error);

		process.exit();
	}
}

if (!config) {
	console.error('JS+ error: missing config');

	process.exit();
}

/* main */
const compileDir = (filenames: string[]) => {
	for (const inFile of filenames) {
		if (fs.statSync(inFile).isDirectory()) {
			compileDir(fs.readdirSync(inFile).map((f) => path.join(inFile, f)));

			continue;
		}

		/* file */
		const outFile = joinCwd(
			config.outDir,
			inFile.split('\\').slice(1).join('\\').replace('.jsp', '.js'),
		);

		fs.mkdirSync(path.dirname(outFile), { recursive: true });

		fs.writeFileSync(outFile, compile(fs.readFileSync(inFile, 'utf8')), 'utf8');
	}
};

compileDir([config.inDir]);
