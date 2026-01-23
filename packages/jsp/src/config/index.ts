export type Config = {
	include?: string[];
	exclude?: string[];
	compiler?: {
		emitLang?: 'JavaScript' | 'TypeScript';
		emitDir?: string;
	};
};

export const getInitConfig = () => {
	return {
		$schema: 'https://github.com/t1xx1/jsp/blob/main/packages/jsp/src/config/$schema.json',
	};
};

export type CompleteConfig = Required<Config> & {
	compiler: Required<Config['compiler']>;
};
export const completeConfig: CompleteConfig = {
	include: ['./**'],
	exclude: [],
	compiler: {
		emitLang: 'JavaScript',
		emitDir: './dist',
	},
};

export const mergeConfig = (config: Config): CompleteConfig => {
	return {
		include: config.include ?? completeConfig.include,
		exclude: config.exclude ?? completeConfig.exclude,
		compiler: {
			emitLang: config.compiler?.emitLang ?? completeConfig.compiler.emitLang,
			emitDir: config.compiler?.emitDir ?? completeConfig.compiler.emitDir,
		},
	};
};
