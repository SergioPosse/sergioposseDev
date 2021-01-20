import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import svg from 'rollup-plugin-svelte-svg';
// import copy from 'rollup-plugin-copy'
import copy from 'rollup-plugin-copy-watch'



const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;
	
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'	
		// gmail: '/images/gmail.svg',
		// github: '/images/github.svg',
		// whatsapp: '/images/whatsapp.svg'
	},
	plugins: [
		copy({
			// the watch option is passed directly to Chokidar, so it can be a file,
			// dir, array or glob(s)
			watch: 'static',
	   
			targets: [
			  { src: 'src/index.html', dest: 'dist/public' },
			  { src: ['assets/fonts/arial.woff', 'assets/fonts/arial.woff2'], dest: 'dist/public/fonts' },
			  { src: 'assets/images/**/*', dest: 'dist/public/images' }
			]
		  }),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
		svg({
			// process SVG to DOM Node or String. Default: false
			stringify: false
		  })
	],
	watch: {
		clearScreen: false
	}
};