declare global {
	interface Object {
		keysLength: (object: object) => number;
		getOwnPropertyNamesLength: (object: object) => number;
		getOwnPropertySymbolsLength: (object: object) => number;
	}
}

Object.keysLength = (object) => {
	return Object.keys(object).length;
}
Object.getOwnPropertyNamesLength = (object) => {
	return Object.getOwnPropertyNames(object).length;
}
Object.getOwnPropertySymbolsLength = (object) => {
	return Object.getOwnPropertySymbols(object).length;
}