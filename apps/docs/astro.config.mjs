import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
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
		svelte(),
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
			plugins: [
				starlightLinksValidator(),
				starlightSidebarTopics([
					{
						label: 'General',
						icon: 'open-book',
						link: '/overview',
						items: [
							'overview',
							{
								label: 'Getting started',
								items: ['gettingstarted', 'integratejs', 'integratets', 'vscodeextension'],
							},
							{
								label: 'Config',
								items: ['config', 'config/reference', 'config/tsconfig'],
							},
							'changelog',
							{
								label: 'Internals',
								items: ['philosophy', 'branding', 'tech'],
								collapsed: true,
							},
						],
					},
					{
						label: 'Language',
						icon: 'rocket',
						link: '/language',
						items: [
							{
								label: 'Overview',
								items: [
									'language',
									'language/features',
									'language/subset',
									'language/proposals',
									'language/customplugins',
								],
							},
							{
								label: 'Syntax',
								autogenerate: {
									directory: 'language/syntax',
								},
							},
							{
								label: 'Polyfills',
								autogenerate: {
									directory: 'language/polyfill',
								},
							},
							{
								label: 'Runtime',
								autogenerate: {
									directory: 'language/runtime',
								},
							},
							{
								label: 'Other',
								items: ['language/proposalsbytype'],
								collapsed: true,
							},
						],
					},
				]),
			],
		}),
	],
});
