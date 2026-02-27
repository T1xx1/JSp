import { emit, convertSrcToEmitFilename, type CompleteConfig } from './_.js';

export type SourceMap = {
	version: number;
	file: string;
	sourceRoot: string;
	sources: string[];
	names: string[];
	mappings: string;
};

export const emitSourceMap = (
	filename: string,
	sourceMap: SourceMap,
	config: CompleteConfig,
): void => {
	emit(convertSrcToEmitFilename(filename, config) + '.map', JSON.stringify(sourceMap), config);
};
