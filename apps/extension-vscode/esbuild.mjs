import { rmSync } from 'node:fs';

import esbuild from 'esbuild';

const dev = process.argv.includes('--dev');

async function main() {
	rmSync('./dist', { recursive: true, force: true });

	const ctx = await esbuild.context({
		entryPoints: ['./src/extension.ts'],
		bundle: true,
		format: 'cjs',
		minify: !dev,
		platform: 'node',
		target: 'node16',
		outfile: './dist/extension.js',
		external: ['@babel/preset-typescript', 'vscode'],
	});

	if (dev) {
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
