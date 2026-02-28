import { dirname } from 'node:path';

import {
	compile,
	getCompleteConfig,
	getEmitLangExt,
	getInternals,
	join,
} from '@jsplang/jsp/compiler';
import { transformWithEsbuild, type Plugin } from 'vite';

const VIRTUAL_JSP_PREFIX = 'jsp:';

export default function (): Plugin<any> {
	const config = getCompleteConfig();
	const internals = new Map(getInternals());

	return {
		name: '@jsplang/vite-plugin-jsp',
		version: '0.1.0',
		enforce: 'pre',
		resolveId(filename, importer) {
			if (importer?.startsWith(VIRTUAL_JSP_PREFIX)) {
				return {
					id: join(dirname(importer), filename),
					moduleSideEffects: false,
				};
			}

			if (internals.has(filename)) {
				return {
					id: VIRTUAL_JSP_PREFIX + filename,
					moduleSideEffects: false,
				};
			}
		},
		async load(filename) {
			if (!filename.startsWith(VIRTUAL_JSP_PREFIX)) {
				return;
			}

			/* rm jsp: prefix */
			const internalFilename = filename.slice(4);

			return await transformWithEsbuild(
				internals.get(internalFilename)!,
				internalFilename + getEmitLangExt(config),
			);
		},
		async transform(code, filename) {
			if (!filename.endsWith('.jsp')) {
				return;
			}

			const tsCode = compile(filename, code, config);

			if (tsCode.code === null || tsCode.sourceMap === null) {
				return;
			}

			const out = await transformWithEsbuild(
				tsCode.code,
				filename.replace('.jsp', getEmitLangExt(config)),
			);

			return {
				code: out.code,
			};
		},
	};
}
