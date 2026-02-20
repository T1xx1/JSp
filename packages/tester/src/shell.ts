import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, globSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, parse, relative } from 'node:path';
import { chdir, cwd, exit } from 'node:process';
import { fileURLToPath } from 'node:url';

import { transformSync } from '@babel/core';
/* @ts-expect-error */
import babelPluginTransformTypescript from '@babel/plugin-transform-typescript';

const testerRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const packageRoot = cwd();
const packageTransformator = await import('file://' + join(packageRoot, 'src/index.ts'));
const packageTestsDir = join(packageRoot, 'tests');
const emitDir = join(packageTestsDir, 'out');

/*  */

rmSync(emitDir, { recursive: true, force: true });

const testFilenames = globSync([join(packageTestsDir, '**/*.jsp')], {
	exclude: ['out/**'],
});

if (testFilenames.length === 0) {
	exit();
}

for (const testFilename of testFilenames) {
	const jsp = readFileSync(testFilename, 'utf8');

	const js = transformSync(jsp, {
		plugins: [babelPluginTransformTypescript, packageTransformator.default],
	});

	if (!js || !js.code) {
		throw new Error('Tester error: null Babel transformation');
	}

	const path = join(
		emitDir,
		dirname(relative(packageTestsDir, testFilename)),
		parse(testFilename).name + '.test.js',
	);

	mkdirSync(dirname(path), { recursive: true });

	writeFileSync(path, js.code, 'utf8');
}

chdir(testerRoot);

execSync(`pnpm exec vitest --dir ${emitDir}`, {
	stdio: 'inherit',
	encoding: 'utf8',
});
