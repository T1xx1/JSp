import { transformSync } from '@babel/core';

export const compile = (jspCode: string): string => {
	if (jspCode === '') {
		return '';
	}

	const jsCode = transformSync(jspCode, {
		plugins: [
			'@babel/plugin-transform-typescript',
			'@babel/plugin-proposal-export-default-from',
			'@babel/plugin-proposal-do-expressions',
			[
				'@babel/plugin-proposal-pipeline-operator',
				{
					proposal: 'hack',
					topicToken: '%',
				},
			],
		],
	});

	if (!jsCode || !jsCode.code) {
		throw new Error('JSp error 1: Null babel transformation');
	}

	return jsCode.code;
};
