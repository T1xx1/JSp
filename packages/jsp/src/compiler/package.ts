import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { join } from './_.js';

export const SCRIPT_ROOT = fileURLToPath(import.meta.url);

export type PackageJson = {
	name: string;
	version: string;
	type: 'commonjs' | 'module';
	peerDependencies: Record<string, string>;
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
	engines: {
		node: string;
	};
};
export const PACKAGE_JSON = JSON.parse(
	readFileSync(join(SCRIPT_ROOT, '../../../package.json'), 'utf8'),
) as PackageJson;

export const getDependencyVersion = (dependencyName: string): null | string => {
	const dep = PACKAGE_JSON.dependencies[dependencyName];
	const devDep = PACKAGE_JSON.devDependencies[dependencyName];

	if (!dep && !devDep) {
		return null;
	}

	if (dep) {
		return dep.replaceAll('^', '');
	}
	if (devDep) {
		return devDep.replaceAll('^', '');
	}

	return null;
};
