import { Parser as P } from 'acorn';

export type PartialPlugin = {
	parser?: (Parser: typeof P) => typeof P;
};

export type Plugin = Required<PartialPlugin>;

/*  */

export const createPlugin = (plugin: PartialPlugin): Plugin => {
	return {
		parser: (Parser) => {
			return Parser;
		},
		...plugin,
	};
};
