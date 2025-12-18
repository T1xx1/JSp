import path from 'node:path';
import process from 'node:process';

export const joinCwd = (...paths: string[]) => {
	return path.join(process.cwd(), ...paths);
};
