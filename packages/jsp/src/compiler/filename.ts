export const join = (...paths: string[]): string => {
	return paths.join('/');
};

export const normalizeSlashes = (filename: string): string => {
	return filename.replaceAll('\\', '/');
};
