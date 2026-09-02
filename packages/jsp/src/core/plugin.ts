import { Parser } from 'acorn';

export type Plugin = {
	parser: (acornParser: typeof Parser) => typeof Parser;
};

export const createPlugin = (plugin: Plugin) => {
	return plugin;
};
