import { compile, getCompleteConfig } from '@jsplang/jsp/compiler';
import { transformWithEsbuild, type Plugin } from 'vite';

export default function (): Plugin<any> {
	const config = getCompleteConfig();

	return {
		name: '@jsplang/vite-plugin-jsp',
		version: '0.1.0',
		enforce: 'pre',
		async transform(code, filename) {
			if (!filename.endsWith('.jsp')) {
				return;
			}

			const outTs = compile(filename, code, config);

			if (outTs.code === null || outTs.sourceMap === null) {
				return;
			}

			const out = await transformWithEsbuild(outTs.code, filename.replace('.jsp', '.ts'));

			return {
				code: out.code,
			};
		},
	};
}
