import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import starlightLinksValidator from 'starlight-links-validator';
import starlightSidebarTopics from 'starlight-sidebar-topics';

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	site: 'https://jsplang.vercel.app',
	integrations: [
		starlight({
			title: '',
			favicon: '/favicon.svg',
			logo: {
				src: './src/assets/logo.png',
			},
			description: 'Use TC39 proposals today',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/t1xx1/jsp' }],
			editLink: {
				baseUrl: 'https://github.com/t1xx1/jsp/edit/main/',
			},
			customCss: ['./src/styles/index.css'],
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: true,
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap',
					},
				},
			],
			customCss: ['./src/styles/index.css'],
			plugins: [starlightLinksValidator(), starlightSidebarTopics([])],
		}),
	],
});
