export const normalizeSlashes = (filename: string): string => {
	return filename.replaceAll('\\', '/');
};
