import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { emitCode, getEmitLangExt, internalDir, type CompleteConfig } from './_.js';

const polyfillsDir = join(internalDir, 'polyfills');
const polyfills = [
	'@jsplang/polyfill-iterator-chunking',
	'@jsplang/polyfill-math-clamp',
	'@jsplang/polyfill-object-propertycount',
	'@jsplang/polyfill-promise-allkeyed',
	'@jsplang/polyfill-promise-ispromise',
	'@jsplang/polyfill-random-namespace',
];

export const getPolyfill = (packageName: string) => {
	const polyfillCodePath = createRequire(import.meta.url).resolve(packageName);

	return readFileSync(polyfillCodePath, 'utf8');
};

export const getPolyfills = () => {
	const polyfillsMap = new Map<string, string>();

	for (const polyfill of polyfills) {
		const polyfillFilename = polyfill.replace('@jsplang/polyfill-', '');

		polyfillsMap.set(polyfillFilename, getPolyfill(polyfill));
	}

	return polyfillsMap;
};

export const emitPolyfills = (config: CompleteConfig) => {
	const polyfillsMap = getPolyfills();

	/* _jsp/polyfills/index */
	const polyfillsIndex =
		[...polyfillsMap.keys()]
			.map((polyfillName) => {
				return `import './${polyfillName}';`;
			})
			.join('\n') + '\n';

	emitCode(join(polyfillsDir, '_' + getEmitLangExt(config)), polyfillsIndex, config);

	for (const [polyfillName, polyfillCode] of polyfillsMap) {
		emitCode(join(polyfillsDir, polyfillName + getEmitLangExt(config)), polyfillCode, config);
	}
};
