declare global {
	interface ObjectConstructor {
		/**
		 * @see https://jsplang.vercel.app/language/polyfill/objectpropertycount
		 */
		keysLength(object: object): number;
		/**
		 * @see https://jsplang.vercel.app/language/polyfill/objectpropertycount
		 */
		getOwnPropertyNamesLength(object: object): number;
		/**
		 * @see https://jsplang.vercel.app/language/polyfill/objectpropertycount
		 */
		getOwnPropertySymbolsLength(object: object): number;
	}
}

Object.keysLength = function (object) {
	return Object.keys(object).length;
};
Object.getOwnPropertyNamesLength = function (object) {
	return Object.getOwnPropertyNames(object).length;
};
Object.getOwnPropertySymbolsLength = function (object) {
	return Object.getOwnPropertySymbols(object).length;
};
