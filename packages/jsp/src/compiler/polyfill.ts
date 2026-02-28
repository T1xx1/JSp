import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative } from 'node:path';

import {
	getEmitLangExt,
	normalizeSlashes,
	type CompleteConfig,
	type VirtualFile,
	type VirtualFileSystem,
} from './_.js';

const polyfillsDir = './_jsp/polyfills';

const polyfillPackageNames = [
	'@jsplang/polyfill-iterator-chunking',
	'@jsplang/polyfill-math-clamp',
	'@jsplang/polyfill-object-propertycount',
	'@jsplang/polyfill-promise-allkeyed',
	'@jsplang/polyfill-promise-ispromise',
	'@jsplang/polyfill-random-namespace',
];

export const getPolyfill = (packageName: string, config: CompleteConfig): VirtualFile => {
	const polyfillFilename = normalizeSlashes(
		join(polyfillsDir, packageName.replaceAll('@jsplang/polyfill-', '') + getEmitLangExt(config)),
	);

	const polyfillCodePath = createRequire(import.meta.url).resolve(packageName);

	return [polyfillFilename, readFileSync(polyfillCodePath, 'utf8')];
};

export const getPolyfills = (config: CompleteConfig): VirtualFileSystem => {
	const polyfillsEntrypointPath = join(polyfillsDir, '_' + getEmitLangExt(config));

	const polyfillCodes = polyfillPackageNames.map((polyfillPackageName) => {
		return getPolyfill(polyfillPackageName, config);
	});

	const polyfillsEntrypoint =
		[...new Map(polyfillCodes).keys()]
			.map((polyfillName) => {
				return `import '${normalizeSlashes(relative(polyfillsEntrypointPath, polyfillName))}';`;
			})
			.join('\n') + '\n';

	return [
		/* _jsp/polyfills/_ */
		[polyfillsEntrypointPath, polyfillsEntrypoint],
		/* polyfill codes */
		...polyfillCodes,
	];
};
