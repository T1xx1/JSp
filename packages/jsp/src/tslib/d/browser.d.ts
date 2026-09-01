import './std.d.ts';

import type { Loose } from '../std/loosen.ts';

declare global {
	interface Body {
		json(): Promise<unknown>;
	}

	interface Node {
		cloneNode(subtree?: boolean): this;
	}

	interface Storage {
		[name: Loose]: unknown;
	}
}
