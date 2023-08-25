import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			sveltekit(),
			Icons({
				compiler: 'svelte'
			}),
			SvelteKitPWA({
				mode: mode === 'development' ? 'development' : 'production',
				manifest: {
					short_name: 'SK PWA',
					name: 'sveltekit-lucia-starter PWA',
					start_url: '/',
					scope: '/',
					display: 'standalone',
					theme_color: '#ffffff',
					background_color: '#ffffff',
					icons: [
						{
							src: 'pwa-64x64.png',
							sizes: '64x64',
							type: 'image/png'
						},
						{
							src: 'pwa-192x192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: 'pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any'
						},
						{
							src: 'maskable-icon-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'maskable'
						}
					]
				},
				devOptions: {
					enabled: true,
					suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
					type: 'module',
					navigateFallback: '/'
				}
			})
		],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		}
	};
});
