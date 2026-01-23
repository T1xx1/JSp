import { join } from 'node:path';
import { cwd } from 'node:process';

export const joinCwd = (...paths: string[]) => {
	return join(cwd(), ...paths);
};
