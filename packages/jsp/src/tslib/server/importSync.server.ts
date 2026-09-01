import { createRequire } from 'node:module';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
 */
export const importSync = (path: string): unknown => {
	return createRequire(import.meta.url)(path);
};
