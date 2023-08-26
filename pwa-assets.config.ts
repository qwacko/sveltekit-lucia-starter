import { defineConfig, minimalPreset as preset } from '@vite-pwa/assets-generator/config';

console.log('Minimal Preset: ', preset);

export default defineConfig({
	preset,
	images: ['static/logo.svg']
});
