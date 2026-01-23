export type Config = {
	$schema: string;
	include?: string[];
	exclude?: string[];
	compiler?: {
		emitLang?: 'JavaScript' | 'TypeScript';
		emitDir?: string;
	};
};

export const defaultConfig: Config = {
	$schema: 'https://github.com/t1xx1/jsp/blob/main/packages/jsp/src/config/$schema.json',
	include: [
		'./**'
	],
	compiler: {
		emitLang: 'JavaScript',
		emitDir: './dist',
	},
};
