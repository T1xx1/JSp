import { join } from 'node:path';
import { cwd } from 'node:process';

import { normalizeSlashes } from '../_.js';

export const normalizeJspFilename = (filename: string): string => {
	return join(cwd(), normalizeSlashes(`${filename}.ts`.toLowerCase()));
};
