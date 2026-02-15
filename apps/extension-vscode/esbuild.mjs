import { rmSync } from 'node:fs';

import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

async function main() {
	rmSync('./dist', { recursive: true, force: true });

	const ctx = await esbuild.context({
		entryPoints: ['./src/extension.ts'],
		bundle: true,
		format: 'cjs',
		minify: true,
		platform: 'node',
		target: 'node16',
		outfile: './dist/extension.js',
		external: ['@babel/preset-typescript', 'vscode'],
	});

	if (watch) {
		ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

try {
	await main();
} catch (e) {
	console.error(e);
	process.exit(1);
}
