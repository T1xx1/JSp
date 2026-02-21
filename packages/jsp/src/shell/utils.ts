import { env } from 'node:process';

export type PackageJson = {
	version: string;
	engines: {
		node: string;
	};
	peerDependencies: Record<string, string>;
	dependencies: {
		'@babel/core': string;
	} & Record<string, string>;
	devDependencies: {
		typescript: string;
	} & Record<string, string>;
};

export const getRuntime = (): string => {
	const caller = (env['npm_config_user_agent'] ?? 'node').split('/')[0]!;

	if (['bun', 'deno'].includes(caller)) {
		return caller;
	}

	return 'node';
};
