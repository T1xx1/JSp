import type { Page } from './types';

import { proposals } from './proposals';

export const polyfillPages = Object.values<Page>(
	import.meta.glob('./polyfill/*.mdx', { eager: true }),
);
export const runtimePages = Object.values<Page>(
	import.meta.glob('./runtime/*.mdx', { eager: true }),
);
export const syntaxPages = Object.values<Page>(import.meta.glob('./syntax/*.mdx', { eager: true }));

export const allPages = [...syntaxPages, ...polyfillPages, ...runtimePages, ...proposals].sort(
	(a, b) => {
		return a.frontmatter.title.localeCompare(b.frontmatter.title);
	},
);
