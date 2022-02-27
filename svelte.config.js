import vercel from '@sveltejs/adapter-vercel'
import preprocess from 'svelte-preprocess';
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(
		{
			postcss: {
					plugins: [
							tailwind,
							autoprefixer
					]
			}
	}
	),

	kit: {
    adapter: vercel(),
	}
};

export default config;
