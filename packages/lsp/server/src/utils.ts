import { fileURLToPath } from 'node:url';

export const path = (uri: string): string => {
	return fileURLToPath(uri).replaceAll('\\', '/').toLowerCase();
};
