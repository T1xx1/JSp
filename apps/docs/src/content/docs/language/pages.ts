import type { Page } from './types';

import {
	polyfillProposals,
	runtimeProposals,
	syntaxProposals,
	unTypedProposals,
} from './proposals';

export const runtimePages = Object.values<Page>(
	import.meta.glob('./runtime/*.mdx', { eager: true }),
);
export const runtimes = [...runtimePages, ...runtimeProposals].sort((a, b) => {
	return a.frontmatter.title.localeCompare(b.frontmatter.title);
});

export const syntaxPages = Object.values<Page>(import.meta.glob('./syntax/*.mdx', { eager: true }));
export const syntaxes = [...syntaxPages, ...syntaxProposals].sort((a, b) => {
	return a.frontmatter.title.localeCompare(b.frontmatter.title);
});

export const polyfillPages = Object.values<Page>(
	import.meta.glob('./polyfill/*.mdx', { eager: true }),
);
export const polyfills = [...polyfillPages, ...polyfillProposals].sort((a, b) => {
	return a.frontmatter.title.localeCompare(b.frontmatter.title);
});

export const allPages = [...runtimes, ...syntaxes, ...polyfills, ...unTypedProposals].sort(
	(a, b) => {
		return a.frontmatter.title.localeCompare(b.frontmatter.title);
	},
);
