import { Parser as P } from 'acorn';

export type Plugin = {
	parser: (Parser: typeof P) => typeof P;
};

export const createPlugin = (plugin: Plugin) => {
	return plugin;
};
