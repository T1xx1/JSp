import { transpile } from 'typescript';

import { Js, emit, convertSrcToEmitFilename, Ts, type CompleteConfig } from './_.js';

export const emitCode = (filename: string, code: string, config: CompleteConfig): void => {
	if (config.compiler.emitCodeLang === 'JavaScript') {
		code = transpile(code, Ts.config.compilerOptions);
	}

	emit(filename, Js.forceEsm(code), config);
};

export const emitSrcCode = (srcFilename: string, srcCode: string, config: CompleteConfig): void => {
	emitCode(convertSrcToEmitFilename(srcFilename, config), srcCode, config);
};
