import type { Loosen } from './loosen.ts';

declare global {
	interface Array<T> {
		includes(searchElement: Loosen<T>, fromIndex?: number): boolean;
		indexOf(searchElement: Loosen<T>, fromIndex?: number): number;
		lastIndexOf(searchElement: Loosen<T>, fromIndex?: number): number;
	}

	interface ArrayConstructor {
		isArray(arg: any): arg is unknown[];
	}

	interface JSON {
		parse(text: string, reviver?: (this: any, key: string, value: any) => any): unknown;
	}

	interface Map<K, V> {
		has(key: Loosen<K>): boolean;
	}

	interface MapConstructor {
		new <K = unknown, V = unknown>(): Map<K, V>;

		groupBy<K, T>(
			items: Iterable<T>,
			keySelector: (item: T, index: number) => K,
		): Map<K, [T, ...T[]]>;
	}

	interface ObjectConstructor {
		groupBy<K extends PropertyKey, T>(
			items: Iterable<T>,
			keySelector: (item: T, index: number) => K,
		): Partial<Record<K, [T, ...T[]]>>;
	}

	interface Promise<T> {
		catch<TResult = never>(
			onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null,
		): Promise<T | TResult>;

		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null,
		): Promise<TResult1 | TResult2>;
	}

	interface ReadonlyArray<T> {
		includes(searchElement: Loosen<T>, fromIndex?: number): boolean;
		indexOf(searchElement: Loosen<T>, fromIndex?: number): number;
		lastIndexOf(searchElement: Loosen<T>, fromIndex?: number): number;
	}

	interface ReadonlyMap<K, V> {
		has(key: Loosen<K>): boolean;
	}

	interface ReadonlySet<T> {
		has(value: Loosen<T>): boolean;
	}

	interface Set<T> {
		has(value: Loosen<T>): boolean;
	}

	interface SetConstructor {
		new <T = unknown>(): Set<T>;
	}

	interface TypedArray<T> {
		includes(searchElement: Loosen<T>, fromIndex?: number): boolean;
		indexOf(searchElement: Loosen<T>, fromIndex?: number): number;
		lastIndexOf(searchElement: Loosen<T>, fromIndex?: number): number;
	}
}
