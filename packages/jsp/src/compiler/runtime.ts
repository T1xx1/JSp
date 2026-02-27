import { env } from 'node:process';

const USER_AGENT = env['npm_config_user_agent'];

export type Runtime = 'bun' | 'deno' | 'node';
export const RUNTIME = (USER_AGENT?.split('/')[0] ?? 'node') as Runtime;
