import { rmSync } from 'node:fs';

import esbuild from 'esbuild';

const production = process.argv.includes('--production');

async function main() {
	rmSync('./dist', { recursive: true, force: true });

	const ctx = await esbuild.context({
		entryPoints: ['./src/extension.ts'],
		bundle: true,
		format: 'esm',
		minify: production,
		sourcemap: false,
		sourcesContent: false,
		platform: 'node',
		outfile: './dist/extension.js',
		external: ['vscode', '@babel/preset-typescript', '@types+node'],
		logLevel: 'warning',
		plugins: [],
	});

	await ctx.rebuild();
	await ctx.dispose();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
