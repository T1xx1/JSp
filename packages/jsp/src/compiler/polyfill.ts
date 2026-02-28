import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { relative } from 'node:path';

import { join, normalizeSlashes, type VirtualFile, type VirtualFileSystem } from './_.js';

const polyfillsDir = './_jsp/polyfills';

const polyfillPackageNames = [
	'@jsplang/polyfill-iterator-chunking',
	'@jsplang/polyfill-math-clamp',
	'@jsplang/polyfill-object-propertycount',
	'@jsplang/polyfill-promise-allkeyed',
	'@jsplang/polyfill-promise-ispromise',
	'@jsplang/polyfill-random-namespace',
];

export const getPolyfill = (packageName: string): VirtualFile => {
	const polyfillFilename = join(polyfillsDir, packageName.replaceAll('@jsplang/polyfill-', ''));

	const polyfillCodePath = createRequire(import.meta.url).resolve(packageName);

	return [polyfillFilename, readFileSync(polyfillCodePath, 'utf8')];
};

export const getPolyfills = (): VirtualFileSystem => {
	const polyfillCodes = polyfillPackageNames.map((polyfillPackageName) => {
		return getPolyfill(polyfillPackageName);
	});

	const polyfillsEntrypoint =
		[...new Map(polyfillCodes).keys()]
			.map((polyfillName) => {
				return `import '${'./' + normalizeSlashes(relative(polyfillsDir, polyfillName))}';`;
			})
			.join('\n') + '\n';

	return [
		/* _jsp/polyfills/_ */
		[polyfillsDir + '/_', polyfillsEntrypoint],
		/* polyfill codes */
		...polyfillCodes,
	];
};
