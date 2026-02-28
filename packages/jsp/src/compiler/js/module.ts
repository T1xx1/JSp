export const forceEsm = (code: string): string => {
	return code + '\nexport { };';
};
