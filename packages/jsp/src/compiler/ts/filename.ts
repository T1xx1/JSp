import { cwd } from 'node:process';

import { join } from '../_.js';

export const normalizeJspFilename = (filename: string): string => {
	return join(cwd(), `${filename}.ts`.toLowerCase());
};
