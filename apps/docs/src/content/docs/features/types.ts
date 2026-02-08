export type Integration = 'Babel' | 'Custom';

export type Entity = {
	value: boolean;
	stage?: number;
	link?: string;
	integration?: Integration;
};

/* prettier-ignore */
export type Support = {
	tc39?: {
		value: false;
	} | {
		value: true;
		stage: number;
		link: string;
	};
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
		support: Support;
	};
	url: null | string;
};
