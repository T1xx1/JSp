import type { Page } from './types';

import { parseProposals, proposals } from './proposals';

export const pages = Object.values<Page>(import.meta.glob('./syntax/*.mdx', { eager: true }));

export const allPages = [...pages, ...parseProposals(proposals)].sort((a, b) => {
	return a.frontmatter.title.localeCompare(b.frontmatter.title);
});
