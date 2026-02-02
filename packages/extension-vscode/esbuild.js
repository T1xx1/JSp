import { rmSync } from 'node:fs';

import esbuild from 'esbuild';

const production = process.argv.includes('--production');

async function main() {
	rmSync('./dist', { recursive: true, force: true });

	const ctx = await esbuild.build({
		entryPoints: ['./src/extension.ts'],
		bundle: true,
		format: 'esm',
		minify: production,
		sourcemap: false,
		sourcesContent: false,
		platform: 'node',
		outfile: './dist/extension.js',
		external: ['vscode', '@babel/preset-typescript'],
		logLevel: 'warning',
		plugins: [],
	});
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
