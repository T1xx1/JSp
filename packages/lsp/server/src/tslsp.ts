import { join } from 'node:path';
import { cwd } from 'node:process';
import {
	createDocumentRegistry,
	createLanguageService,
	LanguageServiceHost,
	ScriptKind,
	ScriptSnapshot,
	sys,
} from 'typescript';

import { getFiles, hasFile, getFile } from './server';

const config = {
	allowNonTsExtensions: true,
};

const serviceHost: LanguageServiceHost = {
	getCompilationSettings: () => {
		return config;
	},
	getDefaultLibFileName() {
		return join(cwd(), 'node_modules/jsp/node_modules/typescript/lib/lib.d.ts');
	},
	getCurrentDirectory: () => {
		return sys.getCurrentDirectory();
	},
	fileExists: (filename: string) => {
		return hasFile(filename);
	},
	getScriptFileNames: () => {
		return [...getFiles().keys()];
	},
	readFile: (filename: string) => {
		const file = getFile(filename);

		if (!file) {
			return undefined;
		}

		return file.content;
	},
	getScriptVersion: (filename: string) => {
		const file = getFile(filename);

		if (!file) {
			return '0';
		}

		return file.version.toString();
	},
	getScriptSnapshot: (filename: string) => {
		const file = getFile(filename);

		if (!file) {
			return undefined;
		}

		return ScriptSnapshot.fromString(file.content);
	},
	/*  */
	getScriptKind: (filename: string) => {
		if (filename.endsWith('.ts')) {
			return ScriptKind.TS;
		}
		if (filename.endsWith('.jsp')) {
			return ScriptKind.TS;
		}

		return ScriptKind.Unknown;
	},
};

export const tslsp = createLanguageService(serviceHost, createDocumentRegistry());
