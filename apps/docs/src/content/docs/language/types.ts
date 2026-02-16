export type ProposalType = '' | 'Polyfill' | 'Runtime' | 'Syntax';
export type Integration = 'Babel' | 'Custom';

export type Entity = {
	value: boolean;
	stage?: number | 'Inactive';
	link?: string;
	integration?: Integration;
};

/* prettier-ignore */
export type Support = {
	tc39?: {
		value: false;
	} | {
		value: true;
		stage: number | 'Inactive';
		link: string;
	};
	mdn?: {
		value: false;
	} | {
		value: true;
		link: string;
	}
	corejs?: {
		value: false;
	} | {
		value: true;
		link: string;
	},
	babel?: {
		value: false;
	} | {
		value: true;
		link: string;
	};
	civet?: {
		value: false;
	} | {
		value: true;
		link: string;
	};
	other?: {
		value: false;
	} | {
		value: true;
		link: string;
	};
	jsp?: {
		value: false;
	} | {
		value: true;
		integration: Integration;
	};
};

export type Proposal = {
	title: string;
	support: Support;
};
export type Page = {
	frontmatter: {
		title: string;
		proposalType: ProposalType;
		support: Support;
	};
	url: null | string;
};
