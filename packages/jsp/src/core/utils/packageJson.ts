import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type PackageJson = {
	type?: 'commonjs' | 'module';
};

export const getPackageJson = (cwd: string): PackageJson => {
	const path = join(cwd, 'package.json');

	if (!existsSync(path)) {
		return {};
	}

	return JSON.parse(readFileSync(path, 'utf8')) as PackageJson;
};
