import type { PackageJson } from './utils/packageJson.js';
import { exitPrint } from './utils/print.js';

export const checkJsType = ({ packageJson }: { packageJson: PackageJson }): void | never => {
	if (!('type' in packageJson) || packageJson.type === 'commonjs') {
		exitPrint({
			message: 'CommonJS is not supported. Set `type: "module"` in `package.json`.',
			severity: 'error',
		});
	}
};
