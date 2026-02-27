import { DiagnosticCategory } from 'typescript';

import { type DiagnosticCategory as JspDiagnosticCategory } from '../_.js';

export const convertDiagnosticCategory = (
	diagnosticCategory: DiagnosticCategory,
): JspDiagnosticCategory => {
	switch (diagnosticCategory) {
		case DiagnosticCategory.Warning: {
			return 'Warning';
		}
		case DiagnosticCategory.Error: {
			return 'Error';
		}
		default: {
			return 'Info';
		}
	}
};
