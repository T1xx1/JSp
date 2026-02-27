import { ModuleDetectionKind, ModuleKind, ScriptTarget, type CompilerOptions } from 'typescript';

export const config = {
	compilerOptions: {
		/* parser */
		skipLibCheck: true,
		strict: true,
		module: ModuleKind.NodeNext,
		moduleDetection: ModuleDetectionKind.Force /* force ESM */,
		resolveJsonModule: true /* JSON */,
		/* type checking */
		lib: ['lib.dom.d.ts', 'lib.esnext.d.ts'],
		exactOptionalPropertyTypes: true,
		noUncheckedIndexedAccess: true,
		noUncheckedSideEffectImports: true,
		/* linter */
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
} satisfies {
	compilerOptions: CompilerOptions;
};
