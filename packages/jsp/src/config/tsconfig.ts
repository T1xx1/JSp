import {
	ModuleDetectionKind,
	ModuleKind,
	ModuleResolutionKind,
	ScriptTarget,
	type CompilerOptions,
} from 'typescript';

export const tsconfig: {
	compilerOptions: CompilerOptions;
} = {
	compilerOptions: {
		/* parser */
		skipLibCheck: true,
		alwaysStrict: true /* ECMAScript */,
		strict: true /* TypeScript */,
		module: ModuleKind.ESNext,
		moduleResolution: ModuleResolutionKind.Bundler,
		moduleDetection: ModuleDetectionKind.Force,
		resolveJsonModule: true /* JSON */,
		/* type checking */
		exactOptionalPropertyTypes: true,
		lib: ['lib.dom.d.ts', 'lib.esnext.d.ts'],
		noImplicitAny: true,
		noImplicitThis: true,
		noUncheckedIndexedAccess: true,
		noUncheckedSideEffectImports: true,
		/* linter */
		allowUnreachableCode: false,
		allowUnusedLabels: false,
		noImplicitOverride: true,
		noPropertyAccessFromIndexSignature: true,
		noUnusedLocals: true,
		noUnusedParameters: true,
		verbatimModuleSyntax: true,
		/* compiler */
		target: ScriptTarget.ESNext,
		sourceMap: true,
		declaration: true,
		declarationMap: true,
		outDir: './dist',
	},
};
