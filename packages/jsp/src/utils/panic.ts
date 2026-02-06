import { exit } from './exit.js';

export const panic = (duid: string, message: string, error?: Error): never => {
	if (error) {
		console.error(error);
	}

	throw exit(`Panic (${duid}): ${message}`);
};
