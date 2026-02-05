export type Integration = 'Babel' | 'Custom';

export type Page = {
	frontmatter: {
		title: string;
		lastUpdated: string;
		support: {
			tc39?:
				| {
						value: false;
				  }
				| {
						value: true;
						stage: number;
						link: string;
				  };
			babel?:
				| {
						value: false;
				  }
				| {
						value: true;
						link: string;
				  };
			civet?:
				| {
						value: false;
				  }
				| {
						value: true;
						link: string;
				  };
			other?:
				| {
						value: false;
				  }
				| {
						value: true;
						link: string;
				  };
			jsp?:
				| {
						value: false;
				  }
				| {
						value: true;
						integration: Integration;
				  };
		};
	};
	url: string;
};
