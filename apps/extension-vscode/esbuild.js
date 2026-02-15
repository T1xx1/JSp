import { rmSync } from 'node:fs';

import esbuild from 'esbuild';

async function main() {
	rmSync('./dist', { recursive: true, force: true });

	await esbuild.build({
		entryPoints: ['./src/extension.ts'],
		bundle: true,
		format: 'cjs',
		minify: true,
		platform: 'node',
		target: 'node16',
		outfile: './dist/extension.js',
		external: ['@babel/preset-typescript', 'vscode'],
	});
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
