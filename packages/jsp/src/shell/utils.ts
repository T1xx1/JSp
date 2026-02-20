import { env } from 'node:process';

export const getRuntime = (): string => {
	const caller = (env['npm_config_user_agent'] ?? 'node').split('/')[0]!;

	if (['bun', 'deno'].includes(caller)) {
		return caller;
	}

	return 'node';
};
