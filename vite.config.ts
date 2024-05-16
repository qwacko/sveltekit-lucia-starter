import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';
// import { Server } from 'socket.io';
import WsPlugin from './src/lib/server/websocket/websocketPlugin';
// import ServerSingleton from './src/lib/server/websocket/serverSingleton';
// import { updateServerInstance } from './src/hooks.server';

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			sveltekit(),
			WsPlugin({ hmrPort: false }),
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
		// server: {
		// 	proxy: {
		// 		'/wscustom': {
		// 			target: 'http://localhost:3005',
		// 			ws: true
		// 		}
		// 	}
		// },
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		}
	};
});
