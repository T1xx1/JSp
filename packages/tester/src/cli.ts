import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { chdir, cwd, exit } from 'node:process';
import { transformSync } from '@babel/core';

const dir = dirname(dirname(import.meta.url.split('///')[1]));

const moduleDir = cwd();
const module = await import('file:///' + join(moduleDir, 'src/index.ts'));
const moduleTests = join(moduleDir, 'tests');

const transpile = (code: string): string => {
	if (code === '') {
		return '';
	}

	const outCode = transformSync(code, {
		plugins: ['@babel/plugin-transform-typescript', module.default],
	});

	if (!outCode || !outCode.code) {
		throw new Error('Tester error: null babel transformation');
	}

	return outCode.code;
};

const tests = readdirSync(moduleTests);

if (tests.length === 0) {
	exit();
}

for (const test of tests) {
	if (test.includes('.test.js')) {
		continue;
	}

	writeFileSync(
		join(moduleTests, test.split('.')[0] + '.test.js'),
		transpile(readFileSync(join(moduleTests, test), 'utf8')),
		'utf8'
	);
}

chdir(dir);

const log = execSync(`pnpm exec vitest --dir ${join(moduleDir, 'tests')}`);

console.log(log.toString());
